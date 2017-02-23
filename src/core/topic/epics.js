import {normalize} from 'normalizr';

import {topicsSchema, topicSchema} from './schemas';
import {topicActions} from './actions';
import {fetchTopics, fetchTopic} from '../api';
import {dbActions} from '../db';

export function loadTopics(action$) {
  return action$.ofType(topicActions.LOAD_TOPICS)
    .switchMap(({payload}) => fetchTopics(payload));
}

export function loadTopic(action$) {
  return action$.ofType(topicActions.LOAD_TOPIC)
    .switchMap(({payload}) => fetchTopic(payload));
}

export function fetchTopicFulfilled(action$) {
  return action$.ofType(topicActions.FETCH_TOPIC_FULFILLED)
    .map(({payload: {result, type}}) => {
      const data = result.data.data;

      if (type === 'topic') {
        data.replies = data.replies.reverse(); // 按最新排序
        return dbActions.mergeDeep(normalize(data, topicSchema).entities);
      } else {
        return dbActions.mergeDeep(normalize(data, topicsSchema).entities);
      }
    });
}

export const topicEpics = [
  loadTopics,
  loadTopic,
  fetchTopicFulfilled
];