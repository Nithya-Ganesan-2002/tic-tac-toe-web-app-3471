import { component$, useStyles$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { TicTacToe } from "../components/TicTacToe";
import TicTacToeCSS from "../components/TicTacToe.css?inline";

// PUBLIC_INTERFACE
export default component$(() => {
  useStyles$(TicTacToeCSS);
  return (
    <div class="page-container" style="min-height: 100vh;">
      <main>
        <TicTacToe />
      </main>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Tic Tac Toe Game",
  meta: [
    {
      name: "description",
      content: "Play a modern, interactive game of Tic Tac Toe.",
    },
  ],
};
