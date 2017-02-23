import {fromJS} from 'immutable';
import {topicActions} from './actions';

export const TopicState = {
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
  },
  list: []
};

const findIndexByTopidId = (topicList, topicid) =>
  topicList.findIndex((data) => {
    return data.id === topicid;
  });

export function topicReducer(state = fromJS(TopicState), action) {

  if (!topicActions.hasOwnProperty(action.type)) {
    return state;
  }

  const {payload, type} = action;
  const {type: payloadType, param, result} = payload;
  const topicList = state.get('list');

  switch (type) {
    case topicActions.FETCH_TOPIC_PENDING:

      if (payloadType === 'topics') {
        return state.setIn([param.tab, 'isPending'], true);
      }

      return state;

    case topicActions.FETCH_TOPIC_FAILED:

      if (payloadType === 'topics') {
        return state.setIn([param.tab, 'isPending'], false);
      }

      return state;

    case topicActions.FETCH_TOPIC_FULFILLED:

      if (payloadType === 'topics') {
        return state.merge({
          [param.tab]: {
            ...result.data,
            isPending: false
          }
        });
      }

      return state;

    case topicActions.UPDATE_REPLY_UP:
      const findedTopicIndex = findIndexByTopidId(topicList, payload.topicid);
      const findedTopic = topicList.get(findedTopicIndex);
      const findedRepliesIndex = findedTopic.replies.findIndex((reply) => {
        return reply.id === payload.replyid;
      });
      const findedReplies = findedTopic.replies[findedRepliesIndex];
      const findedIndex = findedReplies.ups.findIndex((id) => {
        return id === payload.userid;
      });

      if (findedIndex > -1) {
        payload.action === 'down' && findedReplies.ups.splice(findedIndex, 1);
      } else {
        payload.action === 'up' && findedReplies.ups.push(payload.userid)
      }

      return state.set('list', topicList.set(findedTopicIndex, {...findedTopic}));

    default:
      return state;
  }
}