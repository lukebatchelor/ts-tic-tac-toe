type CellValue = 'X' | 'O' | ' ';
type State = {
  0: CellValue;
  1: CellValue;
  2: CellValue;
  3: CellValue;
  4: CellValue;
  5: CellValue;
  6: CellValue;
  7: CellValue;
  8: CellValue;
  turn: 'X' | 'O' | ' ';
};
type CellName = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type AvailableCells<state extends State> = { [key in CellName]: state[key] extends ' ' ? key : never }[CellName];

type FirstValidMove<state extends State> = state[4] extends ' '
  ? 4
  : state[0] extends ' '
  ? 0
  : state[2] extends ' '
  ? 2
  : state[6] extends ' '
  ? 6
  : state[8] extends ' '
  ? 8
  : state[1] extends ' '
  ? 1
  : state[3] extends ' '
  ? 3
  : state[5] extends ' '
  ? 5
  : state[7] extends ' '
  ? 7
  : never;

type _DoMove<state extends State, c extends 'X' | 'O', cell extends CellName> = cell extends AvailableCells<state>
  ? {
      [key in keyof state]: key extends cell
        ? c
        : key extends 'turn'
        ? state['turn'] extends 'X'
          ? 'O'
          : 'X'
        : state[key];
    }
  : never;

type DoMove<state extends State, cell> = cell extends CellName ? _DoMove<state, 'X', cell> : state;

type HasCWon<c extends 'X' | 'O', state extends State> = c extends
  | // columns
  (state[0] & state[3] & state[6])
  | (state[1] & state[4] & state[7])
  | (state[2] & state[5] & state[8])
  // rows
  | (state[0] & state[1] & state[2])
  | (state[3] & state[4] & state[5])
  | (state[6] & state[7] & state[8])
  // diagonal
  | (state[0] & state[4] & state[8])
  | (state[2] & state[4] & state[6])
  ? true
  : false;

type HasSomeOneWon<state extends State> = HasCWon<'X', state> extends true
  ? 'X has won'
  : HasCWon<'O', state> extends true
  ? 'O has won'
  : 'nobody has won';

type DisplayState<state extends State> = {
  0: [state[0], state[1], state[2]];
  1: [state[3], state[4], state[5]];
  2: [state[6], state[7], state[8]];
  result: HasSomeOneWon<state>;
  turn: state['turn'];
};

type CpuMove<state extends State> = state['turn'] extends 'X'
  ? state
  : state[4] extends ' '
  ? _DoMove<state, 'O', 4>
  : _DoMove<state, 'O', 8>;
type CpuMove2<state extends State> = state['turn'] extends 'X'
  ? state
  : state[0] extends 'X'
  ? state[8] extends 'X'
    ? _DoMove<state, 'O', 1>
    : CpuMoveFallback<state>
  : state[2] extends 'X'
  ? state[6] extends 'X'
    ? _DoMove<state, 'O', 7>
    : CpuMoveFallback<state>
  : CpuMoveFallback<state>;

type CpuMoveFallback<state extends State> = state['turn'] extends 'X'
  ? state
  : HasCWon<'X', state> extends true
  ? state
  : CanWin<'O', state> extends CellName
  ? _DoMove<state, 'O', Exclude<CanWin<'O', state>, ''>>
  : CanWin<'X', state> extends CellName
  ? _DoMove<state, 'O', Exclude<CanWin<'X', state>, ''>>
  : _DoMove<state, 'O', FirstValidMove<state>>;

type CanWin<c extends 'X' | 'O', state extends State> = {
  [key in CellName]: HasCWon<c, DoMove<state, key>> extends true ? key : '';
}[CellName];

type Play<state extends State, move1 = '', move2 = '', move3 = '', move4 = '', move5 = ''> = DisplayState<
  DoMove<
    CpuMoveFallback<
      DoMove<CpuMoveFallback<DoMove<CpuMove2<DoMove<CpuMove<DoMove<state, move1>>, move2>>, move3>>, move4>
    >,
    move5
  >
>;

type initialState = { [key in keyof State]: key extends 'turn' ? 'X' : ' ' };

/**
 *
 *
 * Usage: Play<initialState, 0, 5>
 *  Pass in initial state and a comma separated list of moves and mouseover 'game'
 *  to see the current state of the game!!
 *
 */

type game = Play<initialState, 0, 1, 6, 5, 7>;
