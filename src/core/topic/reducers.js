import {topicActions} from './actions';

const TopicState = {
  all: {
    isPending: false
  },
  ask: {
    isPending: false
  },
  good: {
    isPending: false
  },
  job: {
    isPending: false
  },
  share: {
    isPending: false
  }
};

export function topicReducer(state = TopicState, action) {

  const {payload, type} = action;

  switch (type) {
    case topicActions.FETCH_TOPIC_PENDING:
      return {
        ...state,
        [payload.param.tab]: {
          ...state[payload.param.tab],
          isPending: true
        }
      };
    case topicActions.FETCH_TOPIC_FAILED:
      return {
        ...state,
        [payload.param.tab]: {
          ...state[payload.param.tab],
          isPending: false
        }
      };
    case topicActions.FETCH_TOPIC_FULFILLED:
      return {
        ...state,
        [payload.param.tab]: {
          isPending: false,
          ...payload.result.data
        }
      };
    default:
      return state;
  }
}