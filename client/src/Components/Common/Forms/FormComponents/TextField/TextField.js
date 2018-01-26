import React from 'react';
class TextField extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      label: props.label
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <label>
        {this.state.label}:
        <input type="text" value={this.state.value} onChange={this.handleChange} />
      </label>
    );
  }
}

export default TextField;
