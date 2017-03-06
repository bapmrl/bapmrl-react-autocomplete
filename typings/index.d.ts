import React = __React

declare module 'dml-react-autocomplete' {

  interface AutocompleteProps {
    classNames?: any
    inputProps?: any
    maxVisible?: number
    onValueChange?: Function
    onOptionSelected?: Function
    onReturn?: Function
    options: Function
    wait?: number
    autoFocus?: boolean
  }

  export class Autocomplete extends React.Component<AutocompleteProps, {}> {}
}
