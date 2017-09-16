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

function updateThePage(type) {
  ReactDOM.render(<Menu type={type}/>, document.getElementById('app'), () => {
    require('./tests').run()
  })
}

function handleTypeChange(event) {
  updateThePage(event.target.value)
}

function buildTypeOptions() {
  const defaultOption = <option key="default" disabled value="default"> -- select an option -- </option>

  const typeNameArray = [ ...new Set(DATA.items.map(item => item.type)) ]

  const typeOptions = typeNameArray
                          .sort()
                          .map(type => <option key={type} value={type}>{type}</option>)

  return [ defaultOption, ...typeOptions ]
}

function filterItems(items, type) {
  const filteredItems = type ? items.filter(item => item.type === type) : items

  return filteredItems
          .sort(sortBy('name'))
          .map(item => <li key={item.id}>{item.name}</li>)
}

function Menu(props) {
  const items = filterItems(DATA.items, props.type)

  const types = buildTypeOptions()

  return (
    <div>
      <h1>{DATA.title}</h1>
      <select defaultValue="default" onChange={handleTypeChange}>
        {types}
      </select>
      <ul>
        {items}
      </ul>
    </div>
  )
}

updateThePage()
