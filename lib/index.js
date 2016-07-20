'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _lodash = require('lodash.throttle');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Autocomplete = function (_Component) {
  _inherits(Autocomplete, _Component);

  function Autocomplete(props) {
    _classCallCheck(this, Autocomplete);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Autocomplete).call(this, props));

    _this.state = {
      value: props.inputProps.value,
      options: [],
      hoveredOptionIndex: null,
      selectedOption: null
    };

    _this._throttledUpdateOptions = (0, _lodash2.default)(_this._throttledUpdateOptions.bind(_this), props.wait);

    _this._onChange = _this._onChange.bind(_this);
    _this._onDocumentClick = _this._onDocumentClick.bind(_this);
    _this._onKeyDown = _this._onKeyDown.bind(_this);
    _this._keyDownHandlers = {
      13: _this._onReturn,
      27: _this._onEscape,
      38: _this._onArrowUp,
      40: _this._onArrowDown
    };
    _this._onMouseLeave = _this._onMouseLeave.bind(_this);
    return _this;
  }

  _createClass(Autocomplete, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var listNode = this.state.options.length ? _react2.default.createElement(
        'ul',
        { onMouseLeave: this._onMouseLeave,
          className: this.props.classNames.options },
        this.state.options.map(function (option, index) {
          return _react2.default.createElement(
            'li',
            { key: option.key, onClick: _this2._onListItemClick(index),
              onMouseMove: _this2._onMouseMove(index),
              className: _this2.props.classNames.option + (index === _this2.state.hoveredOptionIndex ? ' ' + _this2.props.classNames.optionHover : '') },
            option.label
          );
        })
      ) : null;
      return _react2.default.createElement(
        'div',
        { className: this.props.classNames.autocomplete },
        _react2.default.createElement('input', _extends({}, this.props.inputProps, { type: 'text', autoCapitalize: 'none',
          autoComplete: 'off', autoCorrect: 'off',
          className: this.props.classNames.input, onChange: this._onChange,
          onKeyDown: this._onKeyDown, ref: 'input', spellCheck: 'false',
          value: this.state.value })),
        listNode
      );
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      if (prevState.options !== this.state.options) {
        if (!prevState.options.length && this.state.options.length) {
          document.addEventListener('click', this._onDocumentClick);
        } else if (prevState.options.length && !this.state.options.length) {
          document.removeEventListener('click', this._onDocumentClick);
        }
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.props.inputProps.value !== nextProps.inputProps.value) {
        this._throttledUpdateOptions.cancel();
        this.setState({
          value: nextProps.inputProps.value,
          hoveredOptionIndex: null,
          selectedOption: null
        });
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this._throttledUpdateOptions.cancel();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utils.shallowEqual)(this.props.classNames, nextProps.classNames) || !(0, _utils.shallowEqual)(this.props.inputProps, nextProps.inputProps) || this.props.maxVisible !== nextProps.maxVisible || !(0, _utils.shallowEqual)(this.state, nextState);
    }
  }, {
    key: '_onArrowDown',
    value: function _onArrowDown(e) {
      if (this.state.options) {
        e.preventDefault();
        this._moveHover(1);
      }
    }
  }, {
    key: '_onArrowUp',
    value: function _onArrowUp(e) {
      if (this.state.options) {
        e.preventDefault();
        this._moveHover(-1);
      }
    }
  }, {
    key: '_onChange',
    value: function _onChange(e) {
      var value = e.target.value;
      this.setState({ value: value, hoveredOptionIndex: null, selectedOption: null });
      this.props.onValueChange(value);
      this._throttledUpdateOptions(value);
    }
  }, {
    key: '_onDocumentClick',
    value: function _onDocumentClick(e) {
      var inputNode = _reactDom2.default.findDOMNode(this.refs.input);
      if (this.state.options && e.target !== inputNode) {
        this.setState({ options: [] });
      }
    }
  }, {
    key: '_onEscape',
    value: function _onEscape(e) {
      if (this.state.options) {
        e.preventDefault();
        this.setState({ options: [], hoveredOptionIndex: null });
      }
    }
  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(e) {
      var handler = this._keyDownHandlers[e.keyCode];
      if (handler) {
        handler.call(this, e);
      }
    }
  }, {
    key: '_onListItemClick',
    value: function _onListItemClick(index) {
      var _this3 = this;

      return function () {
        _this3._selectOption(index);
      };
    }
  }, {
    key: '_onMouseMove',
    value: function _onMouseMove(index) {
      var _this4 = this;

      return function () {
        if (index !== _this4.state.hoveredOptionIndex) {
          _this4.setState({ hoveredOptionIndex: index });
        }
      };
    }
  }, {
    key: '_onMouseLeave',
    value: function _onMouseLeave() {
      this.setState({ hoveredOptionIndex: null });
    }
  }, {
    key: '_onReturn',
    value: function _onReturn(e) {
      if (this.state.hoveredOptionIndex !== null) {
        e.preventDefault();
        this._selectOption(this.state.hoveredOptionIndex);
      } else if (this.props.onReturn) {
        this.setState({
          options: [],
          hoveredOptionIndex: null,
          selectedOption: null
        });
        this.props.onReturn(e);
      }
    }
  }, {
    key: '_moveHover',
    value: function _moveHover(delta) {
      var hoveredOptionIndex = this.state.hoveredOptionIndex === null ? delta > 0 ? delta - 1 : delta : this.state.hoveredOptionIndex + delta;
      var length = this.state.options.length;
      if (hoveredOptionIndex < 0) {
        hoveredOptionIndex += length;
      } else if (hoveredOptionIndex >= length) {
        hoveredOptionIndex -= length;
      }
      this.setState({
        value: this.state.options[hoveredOptionIndex].label,
        hoveredOptionIndex: hoveredOptionIndex
      });
    }
  }, {
    key: '_selectOption',
    value: function _selectOption(index) {
      var selectedOption = this.state.options[index];
      this.setState({
        value: selectedOption.label,
        options: [],
        hoveredOptionIndex: null,
        selectedOption: selectedOption
      });
      this.props.onOptionSelected(selectedOption);
    }
  }, {
    key: '_throttledUpdateOptions',
    value: function _throttledUpdateOptions(value) {
      var _this5 = this;

      this.props.options(value).then(function (options) {
        _this5.setState({
          options: options.slice(0, _this5.props.maxVisible),
          hoveredOptionIndex: null,
          selectedOption: null
        });
      }, function (error) {
        console.error(error);
        _this5.setState({
          options: [],
          hoveredOptionIndex: null,
          selectedOption: null
        });
      });
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.state.value;
    }
  }, {
    key: 'getSelectedOption',
    value: function getSelectedOption() {
      return this.state.selectedOption;
    }
  }, {
    key: 'hasHoveredOption',
    value: function hasHoveredOption() {
      return this.state.hoveredOptionIndex !== null;
    }
  }]);

  return Autocomplete;
}(_react.Component);

exports.default = Autocomplete;


Autocomplete.propTypes = {
  classNames: _react.PropTypes.shape({
    autocomplete: _react.PropTypes.string,
    input: _react.PropTypes.string,
    options: _react.PropTypes.string,
    option: _react.PropTypes.string,
    optionHover: _react.PropTypes.string
  }),
  inputProps: _react.PropTypes.shape({
    autoFocus: _react.PropTypes.bool,
    disabled: _react.PropTypes.bool,
    form: _react.PropTypes.string,
    maxLength: _react.PropTypes.number,
    name: _react.PropTypes.string,
    pattern: _react.PropTypes.string,
    placeholder: _react.PropTypes.string,
    readOnly: _react.PropTypes.bool,
    required: _react.PropTypes.bool,
    size: _react.PropTypes.number,
    tabIndex: _react.PropTypes.number,
    title: _react.PropTypes.string,
    value: _react.PropTypes.string
  }),
  maxVisible: _react.PropTypes.number,
  onValueChange: _react.PropTypes.func,
  onOptionSelected: _react.PropTypes.func,
  onReturn: _react.PropTypes.func,
  options: _react.PropTypes.func.isRequired,
  wait: _react.PropTypes.number
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
    tabIndex: null,
    title: null,
    value: ''
  },
  maxVisible: 10,
  onValueChange: function onValueChange() {},
  onOptionSelected: function onOptionSelected() {},
  wait: 250
};