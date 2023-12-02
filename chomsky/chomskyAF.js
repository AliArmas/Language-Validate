class ChomskyPDA {
  constructor() {
    this.stack = [];
    this.states = new Map();
    this.currentState = 'S';

    this.states.set('S', [
      { nextState: ['A', 'B'], error: "error en declaración de estructura", value: 'A', terminal: false }
    ]);
    this.states.set('A', [
      { regex: /^int/, error: "error en declaración de estructura", value: 'A', terminal: true },
    ]);
    this.states.set('B', [
      { nextState: "C", error: "error en nombre", value: 'B', terminal: false },
      { nextState: "D", error: "error en nombre", value: 'A', terminal: false }
    ]);
    this.states.set('C', [
      { nextState: "LE", error: "error en nombre", terminal: false },
      { nextState: "RL", error: "error en nombre", terminal: false }
    ]);
    this.states.set('LE', [
      { regex: /^[a-zA-Z]/, nextState: "RL", error: "error en nombre", terminal: true },
    ]);
    this.states.set('IN', [
      { nextState: "LE", error: "error en nombre", terminal: false }
    ]);
    this.states.set('RL', [
      { nextState: "LE", error: "error en nombre", terminal: false }
    ]);
    this.states.set('q5', [
      { nextState: "q6", rule: /^-$/, error: "error-q5" }
    ]);
    this.states.set('q6', [
      { nextState: "q7", rule: /^0$/, error: "error-q6" },
      { nextState: "q8", rule: /^1$/, error: "error-q6" }
    ]);
    this.states.set('q7', [
      { nextState: "q9", rule: /^0$/, error: "error-q7" },
      { nextState: "q10", rule: /^[1-9]$/, error: "error-q7" }
    ]);
    
    this.states.set('q8', [
      { nextState: "q13", rule: /^[0-9]$/, error: "error-q8" }
    ]);
    
    this.states.set('q9', [
      { nextState: "q11", rule: /^[1-9]$/, error: "error-q9" }
    ]);
    
    this.states.set('q10', [
      { nextState: "q15", rule: /^[0-9]$/, error: "error-q10" }
    ]);
    
    this.states.set('q11', [
      { nextState: "q15", rule: /^-$/, error: "error-11" }
    ]);
    
    this.states.set('q12', [
      { nextState: "q15", rule: /^-$/, error: "error-q12" }
    ]);
    
    this.states.set('q13', [
      { nextState: "q14", rule: /^[0-9]$/, error: "error-q13" }
    ]);
    
    this.states.set('q14', [
      { nextState: "q15", rule: /^-$/, error: "error-q14" }
    ]);
    
    this.states.set('q15', [
      { nextState: "q16", rule: /^[a-z]$/, error: "error-q15" }
    ]);

  }



  addState(name, transitions) {
    this.states.set(name, transitions);
  }

  processInput(input) {
    for (let symbol of input) {
      const transitions = this.states.get(this.currentState);

      if (transitions) {
        const transition = transitions.find(t => {
          return t.inputSymbol === symbol && (t.popSymbol === 'ε' || t.popSymbol === this.stack[this.stack.length - 1]);
        });

        if (transition) {
          this.currentState = transition.nextState;

          if (transition.popSymbol !== 'ε') {
            this.stack.pop();
          }

          if (transition.pushSymbol !== 'ε') {
            this.stack.push(transition.pushSymbol);
          }
        } else {
          console.error('Error de transición.');
          return false;
        }
      } else {
        console.error('Estado no definido.');
        return false;
      }
    }

    return this.currentState === 'Accept';
  }
}


const chomskyPDA = new ChomskyPDA();

const inputString = 'int variable';
const isAccepted = chomskyPDA.processInput(inputString);

console.log(`La cadena "${inputString}" es ${isAccepted ? 'aceptada' : 'rechazada'}.`);