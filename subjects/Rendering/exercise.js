////////////////////////////////////////////////////////////////////////////////
// Exercise:
//
// - render DATA.title in an <h1>
// - render a <ul> with each of DATA.items as an <li>
// - now only render an <li> for mexican food (hint: use DATA.items.filter(...))
// - sort the items in alphabetical order by name (hint: use sort-by https://github.com/staygrimm/sort-by#example)
//
// Got extra time?
// - add a select dropdown to make filtering on `type` dynamic
// - add a button to toggle the sort order
// - Hint: you'll need an `updateThePage` function that calls `render`,
//   and then you'll need to call it in the event handlers of the form controls
////////////////////////////////////////////////////////////////////////////////
import React from 'react'
import ReactDOM from 'react-dom'
import sortBy from 'sort-by'

const DATA = {
  title: 'Menu',
  items: [
    { id: 1, name: 'tacos', type: 'mexican' },
    { id: 2, name: 'burrito', type: 'mexican' },
    { id: 3, name: 'tostada', type: 'mexican' },
    { id: 4, name: 'mushy peas', type: 'english' },
    { id: 5, name: 'fish and chips', type: 'english' },
    { id: 6, name: 'black pudding', type: 'english' }
  ]
}

class Menu extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sortAscending: true
    }
  }

  filterItems = (items, type) => {
    const filteredItems = type ? items.filter(item => item.type === type) : items
    const sortDirection = this.state.sortAscending ? sortBy('name') : sortBy('-name')

    return filteredItems
            .sort(sortDirection)
            .map(item => <li key={item.id}>{item.name}</li>)
  }

  buildTypeOptions = (items) => {
    const defaultOption = <option key="default" disabled value="default"> -- select an option -- </option>

    const typeNameArray = [ ...new Set(items.map(item => item.type)) ]

    const typeOptions = typeNameArray
                            .sort()
                            .map(type => <option key={type} value={type}>{type}</option>)

    return [ defaultOption, ...typeOptions ]
  }

  handleTypeChange = (event) => {
    this.setState({ type: event.target.value })
  }

  toggleSortOrder = () => {
    this.setState({ sortAscending: !this.state.sortAscending })
  }

  render() {
    const items = this.filterItems(DATA.items, this.state.type)
    const types = this.buildTypeOptions(DATA.items)

    return (
      <div>
        <h1>{DATA.title}</h1>
        <div>
          <button onClick={this.toggleSortOrder}>Toggle Sort Order</button>
        </div>
        <div>
          <select defaultValue="default" onChange={this.handleTypeChange}>
            {types}
          </select>
        </div>
        <div>
          <ul>
            {items}
          </ul>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Menu/>, document.getElementById('app'), () => {
  require('./tests').run()
})
