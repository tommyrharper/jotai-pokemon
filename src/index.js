import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import { createRecoilStore } from "magiql/recoil-store";
import {
  GraphQLClientProvider,
  GraphQLClient,
  useQuery,
  graphql,
} from "magiql";

const client = new GraphQLClient({
  endpoint: "https://swapi-graphql.netlify.app/.netlify/functions/index",
  useStore: createRecoilStore({
    // optional, by default it uses the `id` field if available otherwise falls back to an unnormalized id
    // this is the default function
    getDataID: (record, type) => (record.id ? `${type}:${record.id}` : null),
  }),
});

const GET_PEOPLE = graphql`
  query PeopleQuery($limit: Int) {
    allPeople(first: $limit) {
      edges {
        node {
          id
          name
          homeworld {
            name
          }
        }
      }
    }
  }
`

const People = () => {
  const { data, status, error } = useQuery(
    GET_PEOPLE,
    {
      variables: {
        limit: 10,
      },
    }
  );

  console.log(`data`, data)
  console.log(`status`, status)
  console.log(`error`, error)

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div>
      {data
        ? data.allPeople?.edges?.map((edge) => (
            <div key={edge.node.id}>
              <b>{edge.node.name}</b> ({edge.node.homeworld?.name})
            </div>
          ))
        : null}
    </div>
  );
};

const App = () => {
  return (
    <GraphQLClientProvider client={client}>
      <People />
    </GraphQLClientProvider>
  );
};


ReactDOM.render(
  <React.StrictMode>
    <GraphQLClientProvider client={client}>
      <App />
    </GraphQLClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
