// Returns true if the supplied userid exists in the array of serialPartLikes
const checkForUserLike = (userId, serialPartLikes) => {
  if (Array.isArray(serialPartLikes) && serialPartLikes.length > 0){
    let index = 0;
    while (index < serialPartLikes.length){
      if (serialPartLikes[index].user === userId){
        return true;
      } else{
        index++;
      }
    }
    return false;
  }
};

export default checkForUserLike;
