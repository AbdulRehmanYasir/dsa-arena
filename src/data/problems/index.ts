import { Problem } from '../../types';
import { ARRAY_PROBLEMS } from './arrays';
import { STRING_PROBLEMS } from './strings';
import { HASHMAP_PROBLEMS } from './hashMaps';
import { LINKEDLIST_PROBLEMS } from './linkedLists';
import { STACK_PROBLEMS } from './stacks';
import { QUEUE_PROBLEMS } from './queues';
import { TREE_PROBLEMS } from './trees';
import { GRAPH_PROBLEMS } from './graphs';
import { RECURSION_PROBLEMS } from './recursion';
import { SORTING_PROBLEMS } from './sorting';
import { SEARCHING_PROBLEMS } from './searching';
import { DP_PROBLEMS } from './dynamicProgramming';

export const ALL_PROBLEMS: Problem[] = [
  ...ARRAY_PROBLEMS,
  ...STRING_PROBLEMS,
  ...HASHMAP_PROBLEMS,
  ...LINKEDLIST_PROBLEMS,
  ...STACK_PROBLEMS,
  ...QUEUE_PROBLEMS,
  ...TREE_PROBLEMS,
  ...GRAPH_PROBLEMS,
  ...RECURSION_PROBLEMS,
  ...SORTING_PROBLEMS,
  ...SEARCHING_PROBLEMS,
  ...DP_PROBLEMS,
];

export {
  ARRAY_PROBLEMS,
  STRING_PROBLEMS,
  HASHMAP_PROBLEMS,
  LINKEDLIST_PROBLEMS,
  STACK_PROBLEMS,
  QUEUE_PROBLEMS,
  TREE_PROBLEMS,
  GRAPH_PROBLEMS,
  RECURSION_PROBLEMS,
  SORTING_PROBLEMS,
  SEARCHING_PROBLEMS,
  DP_PROBLEMS,
};
