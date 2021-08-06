import graphQLFetch from '../src/graphQLFetch.js';

export default async function fetchMenu() {
  const query = `query menuList($search: String) {
    menuList(search: $search) {
      id dishId name image category price description
    }
  }`;
  const data = await graphQLFetch(query);
  return data;
}
