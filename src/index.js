import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash.throttle';
import { shallowEqual } from './utils';

export default class Autocomplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.inputProps.value,
      options: [],
      hoveredOptionIndex: null,
      selectedOption: null
    };

    this._throttledUpdateOptions = throttle(
      this._throttledUpdateOptions.bind(this),
      props.wait
    );

    this._onChange = this._onChange.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._keyDownHandlers = {
      13: this._onReturn,
      27: this._onEscape,
      38: this._onArrowUp,
      40: this._onArrowDown
    };
    this._onMouseLeave = this._onMouseLeave.bind(this);
  }

  render() {
    const listNode = this.state.options.length ? (
      <ul onMouseLeave={this._onMouseLeave}
        className={this.props.classNames.options}>
        {
          this.state.options.map((option, index) =>
            <li key={option.key} onClick={this._onListItemClick(index)}
              onMouseMove={this._onMouseMove(index)}
              className={this.props.classNames.option +
                (index === this.state.hoveredOptionIndex ?
                  ` ${this.props.classNames.optionHover}` : '')}>
              {option.label}
            </li>
          )
        }
      </ul>
    ) : null;
    return (
      <div className={this.props.classNames.autocomplete}>
        <input {...this.props.inputProps} type="text" autoCapitalize="none"
          autoComplete="off" autoCorrect="off"
          className={this.props.classNames.input} onChange={this._onChange}
          onKeyDown={this.state.options.length ? this._onKeyDown : null}
          ref="input" spellCheck="false" value={this.state.value} />
        {listNode}
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.options !== this.state.options) {
      if (!prevState.options.length && this.state.options.length) {
        document.addEventListener('click', this._onDocumentClick);
      } else if (prevState.options.length && !this.state.options.length) {
        document.removeEventListener('click', this._onDocumentClick);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.inputProps.value !== nextProps.inputProps.value) {
      this._throttledUpdateOptions.cancel();
      this.setState({
        value: nextProps.inputProps.value,
        hoveredOptionIndex: null,
        selectedOption: null
      });
    }
  }

  componentWillUnmount() {
    this._throttledUpdateOptions.cancel();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props.classNames, nextProps.classNames) ||
      !shallowEqual(this.props.inputProps, nextProps.inputProps) ||
      this.props.maxVisible !== nextProps.maxVisible ||
      !shallowEqual(this.state, nextState);
  }

  _onArrowDown(e) {
    e.preventDefault();
    this._moveHover(1);
  }

  _onArrowUp(e) {
    e.preventDefault();
    this._moveHover(-1);
  }

  _onChange(e) {
    const value = e.target.value;
    this.setState({ value, hoveredOptionIndex: null, selectedOption: null });
    this.props.onValueChange(value);
    this._throttledUpdateOptions(value);
  }

  _onDocumentClick(e) {
    const inputNode = ReactDOM.findDOMNode(this.refs.input);
    if (this.state.options && e.target !== inputNode) {
      this.setState({ options: [] });
    }
  }

  _onEscape(e) {
    if (this.state.options) {
      e.preventDefault();
      this.setState({ options: [], hoveredOptionIndex: null });
    }
  }

  _onKeyDown(e) {
    const handler = this._keyDownHandlers[e.keyCode];
    if (handler) {
      handler.call(this, e);
    }
  }

  _onListItemClick(index) {
    return () => { this._selectOption(index); };
  }

  _onMouseMove(index) {
    return () => {
      if (index !== this.state.hoveredOptionIndex) {
        this.setState({ hoveredOptionIndex: index });
      }
    };
  }

  _onMouseLeave() {
    this.setState({ hoveredOptionIndex: null });
  }

  _onReturn(e) {
    if (this.state.hoveredOptionIndex !== null) {
      e.preventDefault();
      this._selectOption(this.state.hoveredOptionIndex);
    }
  }

  _moveHover(delta) {
    let hoveredOptionIndex = this.state.hoveredOptionIndex === null ?
      (delta > 0 ? delta - 1 : delta) : this.state.hoveredOptionIndex + delta;
    const length = this.state.options.length;
    if (hoveredOptionIndex < 0) {
      hoveredOptionIndex += length;
    } else if (hoveredOptionIndex >= length) {
      hoveredOptionIndex -= length;
    }
    this.setState({
      value: this.state.options[hoveredOptionIndex].label,
      hoveredOptionIndex
    });
  }

  _selectOption(index) {
    const selectedOption = this.state.options[index];
    this.setState({
      value: selectedOption.label,
      options: [],
      hoveredOptionIndex: null,
      selectedOption
    });
    this.props.onOptionSelected(selectedOption);
  }

  _throttledUpdateOptions(value) {
    this.props.options(value).then(options => {
      this.setState({
        options: options.slice(0, this.props.maxVisible),
        hoveredOptionIndex: null,
        selectedOption: null
      });
    }, error => {
      console.error(error);
      this.setState({
        options: [],
        hoveredOptionIndex: null,
        selectedOption: null
      });
    });
  }

  getValue() {
    return this.state.value;
  }

  getSelectedOption() {
    return this.state.selectedOption;
  }

  hasHoveredOption() {
    return this.state.hoveredOptionIndex !== null;
  }
}

Autocomplete.propTypes = {
  classNames: PropTypes.shape({
    autocomplete: PropTypes.string,
    input: PropTypes.string,
    options: PropTypes.string,
    option: PropTypes.string,
    optionHover: PropTypes.string
  }),
  inputProps: PropTypes.shape({
    autoFocus: PropTypes.bool,
    disabled: PropTypes.bool,
    form: PropTypes.string,
    maxLength: PropTypes.number,
    name: PropTypes.string,
    pattern: PropTypes.string,
    placeholder: PropTypes.string,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    size: PropTypes.number,
    title: PropTypes.string,
    value: PropTypes.string
  }),
  maxVisible: PropTypes.number,
  onValueChange: PropTypes.func,
  onOptionSelected: PropTypes.func,
  options: PropTypes.func.isRequired,
  wait: PropTypes.number
};

Autocomplete.defaultProps = {
  classNames: {
    autocomplete: 'autocomplete',
    input: 'autocompleteInput',
    options: 'autocompleteOptions',
    option: 'autocompleteOption',
    optionHover: 'autocompleteOptionHover'
  },
  inputProps: {
    autoFocus: false,
    disabled: false,
    form: null,
    maxLength: null,
    name: null,
    pattern: null,
    placeholder: '',
    readOnly: false,
    required: false,
    size: 20,
    title: null,
    value: ''
  },
  maxVisible: 10,
  onValueChange: () => {},
  onOptionSelected: () => {},
  wait: 250
};
