import React from 'react';
import { withRouter } from 'react-router-dom';
import SelectAsync from 'react-select/lib/Async'; //eslint-disable-line

import graphQLFetch from './graphQLFetch.js';
import withToast from './withToast.jsx';

class SearchMenu extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeSelection = this.onChangeSelection.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
  }

  onChangeSelection({ value }) {
    const { history } = this.props;
    history.push(`/order/${value}`);
  }

  async loadOptions(term) {
    if (term.length < 3) return [];
    const query = `query menuList($search: String) {
      menuList(search: $search) {
        dishId name
      }
    }`;

    const { showError } = this.props;
    const data = await graphQLFetch(query, { search: term }, showError);
    return data.menuList.map(dish => ({
      label: `# ${dish.name}`,
      value: dish.dishId,
    }));
  }

  render() {
    return (
      <SelectAsync
        instanceId="search-select"
        value=""
        loadOptions={this.loadOptions}
        filterOption={() => true}
        onChange={this.onChangeSelection}
        components={{ DropdownIndicator: null }}
      />
    );
  }
}

export default withRouter(withToast(SearchMenu));
