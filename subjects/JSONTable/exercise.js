////////////////////////////////////////////////////////////////////////////////
// Requirements
//
// - fetch the src with getJSON((error, payload) => {})
// - render the content of the th's from the field names (hint: use
//   the field names from the first record)
// - render each result as a row in <tbody>
import 'purecss/build/pure.css'
import React from 'react'
import { render } from 'react-dom'
import getJSON from './lib/getJSON'
import PropTypes from 'prop-types'

function isURL(content) {
  return (/^https?:\/\//).test(content)
}

function isImageURL(content) {
  return isURL(content) && (/\.(jpe?g|gif|png)$/).test(content)
}

const JSONTable = React.createClass({
  propTypes: {
    src: PropTypes.string.isRequired,
    getData: PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      data: null
    }
  },

  componentDidMount() {
    getJSON(this.props.src, (err, payload) => {
      this.setState({
        data: this.props.getData(payload)
      })
    })
  },

  formatContent(content) {
    if (Array.isArray(content))
      return content.map(this.formatContent)

    if (isImageURL(content))
      return <p><img key={content} height="64" src={content}/></p>

    if (isURL(content))
      return <p><a key={content} href={content}>{content}</a></p>

    return content
  },

  getTableHeaders(fields) {
    return fields.map(field => (<th key={field}>{field}</th>))
  },

  buildRow(fields, data) {
    return (
      <tr key={data.id}>
        {fields.map(field => (<td key={field}>{this.formatContent(data[field])}</td>))}
      </tr>
    )
  },

  render() {
    const { data } = this.state

    if( data == null || data.length === 0 )
      return null

    const fields = Object.keys(data[0])

    return (
      <table className="pure-table pure-table-striped">
        <thead>
          <tr>
            {this.getTableHeaders(fields)}
          </tr>
        </thead>
        <tbody>
          {data.map(item => this.buildRow(fields, item))}
        </tbody>
      </table>
    )
  }
})

const App = React.createClass({
  render() {
    return (
      <div>
        <h1>JSONTable</h1>
        <JSONTable
          src="https://addressbook-api.herokuapp.com/contacts"
          getData={payload => payload.contacts}
        />
      </div>
    )
  }
})

render(<App/>, document.getElementById('app'))
