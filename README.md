# bapmrl-react-autocomplete

`bapmrl-react-autocomplete` is a javascript library, greatly inspired from [react-typeahead](https://github.com/fmoo/react-typeahead), that provides a
simple React Autocomplete Component.

## Usage

```javascript
import Autocomplete from 'bapmrl-react-autocomplete';

<Autocomplete
  options={
    input => Promise.resolve(
      input.split().map((w, index) => { return { key: index, label: w }; })
    )
  }
  onOptionSelected={option => { window.alert(option.label); }}
  ref="autocomplete" />
```

## API

### constructor(props)

#### props.classNames

Type: `Object`
Allowed Keys: `autocomplete`, `input`, `options`, `option`, `optionHover`

An object containing custom class names for child elements.

#### props.inputProps

Type: `Object`

Props to pass directly to the `<input>` element.

#### props.maxVisible

Type: `Number`

Limit the number of elements rendered in the options list.

#### props.onOptionSelected

Type: `Function`

Event handler triggered whenever a user picks an option.

#### props.onValueChange

Type: `Function`

Event handler for the `change` event on the Autocomplete `<input>` element.

#### props.options

Type: `Function`

A function that returns for a given Autocomplete input value a `Promise` for an
`Array` of `Option` objects. An `Option` object must have a React `key`, a
`label` and may carry additional payload.

#### props.wait

Type: `Number`
Default: 250

The number of milliseconds to throttle invocations to the `options` function.

### getValue

Type: `Function`

Returns the Autocomplete input value.

### getSelectedOption

Type: `Function`

Returns the selected `Option`. If the user has picked an option but then changes
the Autocomplete input value this function will return `null`.

### hasHoveredOption

Type: `Function`

Returns `true` when an option is hovered and `false` otherwise.
