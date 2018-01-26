import React from 'react';
class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      user: ''
    };
  }
  componentDidMount(){
  }

  render() {
    return (
      <div>
        <h1> Profile Edit </h1>
        <form>
        </form>
      </div>
    );
  }
}

export default ProfileEdit;
