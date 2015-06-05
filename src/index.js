import React from 'react';
import throttle from 'lodash.throttle';

export default class Autocomplete extends React.Component {
  constructor(props) {
    super(props);
    this._throttledOptions = throttle(props.options, props.wait);

    this.state = {
      value: '',
      options: [],
      hoveredOptionIndex: null,
      selectedOption: null
    };

    this._onChange = this._onChange.bind(this);
    this._onDocumentClick = this._onDocumentClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._keyDownHandlers = {
      13: this._onReturn,
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
            <li key={option.text} onClick={this._onListItemClick(index)}
              onMouseMove={this._onMouseMove(index)}
              className={this.props.classNames.option +
                (index === this.state.hoveredOptionIndex ?
                  ` ${this.props.classNames.optionHover}` : '')}>
              {option.text}
            </li>
          )
        }
      </ul>
    ) : null;
    return (
      <div className={this.props.classNames.autocomplete}>
        <input type="text" autoCapitalize="none" autoComplete="off"
          autoCorrect="off" className={this.props.classNames.input}
          onChange={this._onChange}
          onKeyDown={this.state.options.length ? this._onKeyDown : null}
          ref="input" spellCheck="false" value={this.state.value}
          {...this.props.inputProps} />
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
    this._throttledOptions(value).then(options => {
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

  _onDocumentClick(e) {
    const inputNode = React.findDOMNode(this.refs.input);
    if (this.state.options && e.target !== inputNode) {
      this.setState({ options: [] });
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
      value: this.state.options[hoveredOptionIndex].text,
      hoveredOptionIndex
    });
  }

  _selectOption(index) {
    const selectedOption = this.state.options[index];
    this.setState({
      value: selectedOption.text,
      options: [],
      hoveredOptionIndex: null,
      selectedOption
    });
    this.props.onOptionSelected(selectedOption);
  }

  getValue() {
    return this.state.value;
  }

  getSelectedOption() {
    return this.state.selectedOption;
  }
}

Autocomplete.propTypes = {
  classNames: React.PropTypes.object,
  inputProps: React.PropTypes.object,
  maxVisible: React.PropTypes.number,
  onValueChange: React.PropTypes.func,
  onOptionSelected: React.PropTypes.func,
  options: React.PropTypes.func.isRequired,
  wait: React.PropTypes.number
};

Autocomplete.defaultProps = {
  classNames: {
    autocomplete: null,
    input: null,
    options: null,
    option: null,
    optionHover: null
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
    title: null
  },
  maxVisible: 10,
  onValueChange: () => {},
  onOptionSelected: () => {},
  wait: 250
};