const User = require("../database/mongo/User");
const Serial = require("../database/mongo/Serial");

const typeMap = {
  User: User,
  Serial: Serial,
};

/**
 * Return the names of user-generated fields (also mongo v) of a supplied model
 * that DON'T reference other Mongodb documents.
 *
 * Use this to get potential response attributes.
 * @param {Object} model - A mongoose model (ie: User, Serial, SerialPart, etc)
 */
const getAttributeFields = (model) => {
  try {
    const fields = Object.values(model.schema.paths)
      .filter((documentPath) => documentPath.instance !== "ObjectID")
      .map((field) => field.path);

    return fields;
  } catch (e) {
    throw e;
  }
};
/**
 * Return the names of user-generated fields (also mongo id) of a supplied model
 * that DO reference other Mongodb documents.
 *
 * Use this to get potential response relationships
 * @param {Object} model - A mongoose model (ie: User, Serial, SerialPart, etc)
 */
const getRelationalFields = (model) => {
  try {
    const fields = Object.values(model.schema.paths)
      .filter((documentPath) => documentPath.instance === "ObjectID")
      .map((field) => field.path);
    return fields;
  } catch (e) {
    throw e;
  }
};

/**
 * Return the Schema name of a relational field (ie, User, Serial)
 * 
 * @param {*} baseMode - The model of the instance from which we want the type
 * @param {*} field - The field who's type to return
 */
const getResourceTypeFromBaseModel = (baseModel, field) => {
  const resourceType = baseModel.schema.paths[field].options.ref
    ? baseModel.schema.paths[field].options.ref.toLowerCase()
    : null;
  return resourceType;
};

/**
 * Return a MongoDb model according to a supplied field.
 */
const getRelatedModelFromBaseModel = (baseModel, field) => {
  // ! what if the field isn't a relation
  const resourceType = baseModel.schema.paths[field].options.ref
    ? baseModel.schema.paths[field].options.ref
    : null;
  return resourceType;
};

/**
 * Returns the public name of a resource type:
 * This is specifically for the `type` field of responses
 * Users => user; Serials => serial
 * @param {*} model
 */
const getPublicResourceType = (model) => {
  return model.collection.collectionName.slice(
    0,
    model.collection.collectionName.length - 1
  );
};

/**
 *
 * @param {*} model
 * @param {*} data - the data returned from the mongo query
 * @param {*} fields - a map of arrays
 * @param {*} includes
 */
const createApiResponse = async (model, data, fields, includes) => {
  try {
    // let's figure out which (types of) fields are which, first
    const relationalFields = getRelationalFields(model);
    const attributeFields = getAttributeFields(model);
    
    // iterate through all data, take what's needed (or dump all fields)
    const response = Object.assign({}, null);

    if (Array.isArray(data)) {
      response.data = data.map((databaseDocument) => {
        return {
          id: databaseDocument.id,
          type: getPublicResourceType(model),
          attributes: makeAttributes(
            model,
            databaseDocument,
            fields ? fields[getPublicResourceType(model)] : null,
            attributeFields
          ),
          relationships: relationalFields
            ? relationalFields.reduce((object, relationalField) => {
                if (relationalField[0] !== "_") {
                  object[relationalField] = {
                    data: {
                      id: databaseDocument[relationalField]._id.toString(),
                      type: getResourceTypeFromBaseModel(
                        model,
                        relationalField
                      ),
                    },
                  };
                }
                return object;
              }, {})
            : null,
        };
      });

      // setup includes to be later populated
      const includedData = [];
      // Create includes for our compound doc (if any)
      if (includes && includes.length > 0) {
        // Iterate over all keys in include query
        for (let j = 0; j < includes.length; j++) {
          const includedResource = includes[j];

          // Iterate over base resources (ie, the docs we're processing)
          for (let x = 0; x < data.length; x++) {
            const baseResource = data[x];

            // Check to see that the resource isn't already present in our includes
            if (
              !includedData.find(
                (resource) =>
                  resource.id === baseResource[includedResource]._id.toString()
              )
            ) {
              const resourceTypeString = getRelatedModelFromBaseModel(
                model,
                includedResource
              ); // ie: User, Serial

              const relatedResourceModel = typeMap[resourceTypeString]; // ie, The User Mongo Model

              const includedResourceData = await relatedResourceModel.findById(
                baseResource[includedResource]._id
              );

              const includedResourceRelationalFields = getRelationalFields(
                relatedResourceModel
              );

              const includedResourceAttributeFields = getAttributeFields(
                relatedResourceModel
              );

              includedData.push({
                id: baseResource[includedResource]._id.toString(),
                type: getResourceTypeFromBaseModel(model, includedResource), // ?? what is the model
                // first i need to the type
                // then make a query against the type via string
                attributes: makeAttributes(
                  relatedResourceModel,
                  includedResourceData,
                  fields ? fields[includedResource] : null,
                  includedResourceAttributeFields
                ),
              });
            }
          }
        }

        response.included = includedData;
      }
    } else {
      console.log("not an array");
    }

    return response;
  } catch (e) {
    throw e;
  }
};
/**
 *
 * @param {String} id
 * @param {Array} fields - an array of the fields to retrive
 * @param {*} includes
 */
const createUserResponse = async (id, fields, includes) => {
  const baseData = await User.findById(id);
  const response = {
    data: {
      type: "user",
      id: baseData.id,
    },
  };

  // Handle the attributes
  const attributes = makeAttributes(User, baseData, fields);
  response.data.attributes = attributes;
  return response;
};

/**
 * Create an attributes object
 * @param {Object} model - The mongodb model of the document
 * @param {Object} document - The document to pull attributes from
 * @param {Array} fields - The fields to include in the attributes object (passes all if none supplied)
 */
const makeAttributes = (model, document, selectedFields, allFields) => {
  const attributes = Object.assign({}, null);

  if (!selectedFields) selectedFields = allFields;
  selectedFields.forEach((field) => {
    // never add the password
    // also, don't add underscore prefixed or relational fields
    if (field !== "password" && field[0] !== "_" && !document[field].id) {
      attributes[field] = document[field];
    }
  });
  return attributes;
};

const makeRelationships = (model, document, fields) => {
  const relationships = Object.assign({}, null);
  if (Array.isArray(document)) {
    // if it's an array, go through each document and add the proper relation
  }

  if (!fields)
    fields = Object.values(model.schema.paths).filter(
      (documentPath) => documentPath.instance === "ObjectID"
    );
  fields.forEach((field) => {
    relationships[field] = document[field];
  });
  return relationships;
};
module.exports = {
  createUserResponse,
  createApiResponse,
};
