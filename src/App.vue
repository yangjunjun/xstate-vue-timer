<template>
  <div
    class="timer"
    :data-state="state.toStrings().join(' ')"
    :style="{'--duration': state.context.duration,'--elapsed': state.context.elapsed,'--interval': state.context.interval}"
  >
    <header>
      <a
        href="https://xstate.js.org/viz/?gist=78fef4bd3ae520709ceaee62c0dd59cd"
        title="See the visualization"
        target="_xstate"
      >XState Minute Timer</a>
    </header>
    <svg viewBox="0 0 100 100" width="100" height="100" fill="none" class="circles">
      <circle r="40" cx="50" cy="50" pathLength="1"></circle>
      <circle class="progress" r="40" cx="50" cy="50" pathLength="1"></circle>
    </svg>
    <div class="display">
      <div class="label">{{state.toStrings().slice(-1)[0]}}</div>
      <div
        class="elapsed"
        @click="send('TOGGLE')"
      >{{Math.ceil(state.context.duration - state.context.elapsed)}}</div>
      <div class="controls">
        <button @click="send('RESET')" v-show="!state.matches({ running: 'normal' })">Reset</button>
        <button v-show="state.matches({ running: 'normal' })" @click="send('ADD_MINUTE')">+ 1:00</button>
      </div>
    </div>
    <div class="actions">
      <button
        v-show="state.matches({ running: 'normal' })"
        @click="send('TOGGLE')"
        title="Pause timer"
      >
        <font-awesome-icon icon="pause"/>
      </button>
      <button
        v-show="state.matches({ running: 'overtime' })"
        @click="send('RESET')"
        title="Reset timer"
      >
        <font-awesome-icon icon="stop"/>
      </button>
      <button
        v-show="(state.matches('paused') || state.matches('idle'))"
        @click="send('TOGGLE')"
        title="Start timer"
      >
        <font-awesome-icon icon="play"/>
      </button>
    </div>
  </div>
</template>


<script>
import { useMachine } from "@xstate/vue";
import { createTimerMachine } from "./timerMachine";

export default {
  name: "App",
  setup() {
    const { state, send } = useMachine(createTimerMachine(60), {
      devTools: true
    });
    return { state, send };
  }
};
</script>

<style lang="scss">
.timer {
  --progress: calc((var(--elapsed)) / var(--duration));
   display: grid;
   grid-template-rows: 10vh 1fr 25vh;
   grid-template-areas: 'header' 'main' 'actions';
   height: 100%;

   > header {
     grid-area: header;
   }

  > .circles, > .display {
     grid-area: main;
     align-self: center;
     justify-self: center;
  }

  > .actions {
    grid-area: actions;
  }

  &[data-state~="idle"] {
    .progress {
      transition-duration: .3s;
    }
  }

  &[data-state~="paused"] {
    .elapsed {
      animation: pulse 1s steps(1) infinite;
    }
  }

  &[data-state~="running.overtime"] {
    circle {
      animation: pulse 1s steps(1) infinite;
    }
    .elapsed {
      color: white;
    }
  }

  &[data-state~="running.overtime"] {
    --progress: 1;
  }

  &[data-state~="running.normal"],
  &[data-state~="paused"] {
    --progress: calc((var(--elapsed) + var(--interval)) / var(--duration));
  }
}

.actions {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  > button {
    appearance: none;
    background-color: var(--color-primary);
    color: white;
    height: 4rem;
    width: 4rem;
    border-radius: 4rem;
    border: none;
    font-size: 1.5rem;
    font-weight: bold;
    transition: background-color .3s ease;
    
    &:hover {
      background-color: var(--color-primary-light);
    }
  }
}

button {
  cursor: pointer; 

  &:focus {
    outline: none;
  }
}


.display {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.elapsed {
  color: var(--color-primary);
  font-size: 5rem;
  padding: 1rem;
  transition: color .3s ease;
  cursor: pointer;

  &:hover {
    color: white;
  }
}

.label {
  color: var(--color-secondary);
}

.controls {
  display: flex;
  flex-direction: row;

  > button {
    appearance: none;
    border: none;
    background: transparent;
    color: white;
    font-size: 1rem;
  }
}

.circles {
  transform: rotate(-.25turn);
  height: 100%;
  width: 100%;
  pointer-events: none;
}

circle {
  stroke: white;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-width: 1px;
}

.progress {
  --interval-duration: calc(var(--interval) * 1s);
  transition: stroke-dashoffset var(--interval-duration) linear;
  stroke: var(--color-primary);
  stroke-dashoffset: calc(1 - var(--progress) * -1);
  stroke-dasharray: 1 1;
  stroke-width: 1.1px;
}

@keyframes pulse {
  from, to {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

header {
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    color: white;
    opacity: .5;
    transition: opacity .3s ease;

    &:hover {
      opacity: 1;
    }
  }
}

</style>
