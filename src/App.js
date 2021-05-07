/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { atom, Provider, useAtom } from "jotai";

import "./App.css";

const URL =
  "https://gist.githubusercontent.com/jherr/23ae3f96cf5ac341c98cd9aa164d2fe3/raw/f8d792f5b2cf97eaaf9f0c2119918f333e348823/pokemon.json";

const pokemonAtom = atom(async () => fetch(URL).then((resp) => resp.json()));
const filterAtom = atom("");
const filteredPokemonAtom = atom((get) =>
  get(pokemonAtom).filter((p) =>
    p.name.english.toLowerCase().includes(get(filterAtom).toLowerCase())
  )
);

function FilterInput() {
  const [filter, filterSet] = useAtom(filterAtom);

  return <input value={filter} onChange={(e) => filterSet(e.target.value)} />;
}

function PokemonTable() {
  const [filtered] = useAtom(filteredPokemonAtom);

  return (
    <table width="100%">
      <tbody>
        {filtered.map((p) => (
          <tr key={p.id}>
            <td>{p.name.english}</td>
            <td>{p.type.join(", ")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function App() {
  return (
    <div className="App">
      <FilterInput />
      <PokemonTable />
    </div>
  );
}

export default () => (
  <Provider>
    <React.Suspense fallback={<div>Loading</div>}>
      <App />
    </React.Suspense>
  </Provider>
);
