import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import './styles.css'

const { func, any } = PropTypes


////////////////////////////////////////////////////////////////////////////////
// Requirements
//
// Make this work like a normal <select><option/></select>

class Select extends React.Component {
  static propTypes = {
    onChange: func,
    value: any,
    defaultValue: any
  }

  state = {
    showChildren: false,
    value: this.props.defaultValue || null
  }

  handleSelect = value => {
    const nextState = {
      showChildren: false
    }

    if(this.isUncontrolled()) {
      nextState.value = value
    }

    this.setState(nextState, () => {
      if (this.props.onChange)
        this.props.onChange(value)
    })
  }

  isUncontrolled = () => this.props.value == null

  toggleChildren = event => {
    event.preventDefault()
    this.setState({
      showChildren: !this.state.showChildren
    })
  }

  getChildren = () => {
    return React.Children.map(this.props.children, child => (
      React.cloneElement(child, {
        onSelect: value => this.handleSelect(value)
      })
    ))
  }

  getLabel = () => {
    let label = null

    React.Children.forEach(this.props.children, (child) => {
      const childValue = child.props.value

      if (
        (this.isUncontrolled() && childValue === this.state.value) ||
        (child.props.value === this.props.value)
      ) {
        label = child.props.children
      }
    })

    return label
  }

  render() {
    return (
      <div className="select" onClick={this.toggleChildren}>
        <div className="label">{this.getLabel()}<span className="arrow">▾</span></div>
        {this.state.showChildren && (
          <div className="options">
            {this.getChildren()}
          </div>
        )}
      </div>
    )
  }
}


class Option extends React.Component {
  handleClick = (event) => {
    const { onSelect, value } = this.props
    event.preventDefault()
    onSelect(value)
  }

  render() {
    return (
      <div
        className="option"
        onClick={this.handleClick}>{this.props.children}</div>
    )
  }
}

class App extends React.Component {
  state = {
    selectValue: 'dosa'
  }

  setToMintChutney = () => {
   this.setState({ selectValue: 'mint-chutney' })
  }

  render() {
    return (
      <div>
        <h1>Select/Option</h1>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>

        <h2>Controlled</h2>
        <p>
          <button onClick={this.setToMintChutney}>Set to Mint Chutney</button>
        </p>

        <Select
          value={this.state.selectValue}
          onChange={(selectValue) => this.setState({ selectValue })}
        >
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>

        <h2>Uncontrolled</h2>
        <Select defaultValue="tikka-masala">
          <Option value="tikka-masala">Tikka Masala</Option>
          <Option value="tandoori-chicken">Tandoori Chicken</Option>
          <Option value="dosa">Dosa</Option>
          <Option value="mint-chutney">Mint Chutney</Option>
        </Select>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))
