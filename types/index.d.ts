import { Store, ActionContext, ActionHandler, Module, MutationTree, ModuleTree, ActionTree } from 'vuex/types';
import _Vue from "vue";

import './vuex';

export type AsyncState = {
  pending: number;
}

export type AsyncMutation<S> = {
  pending?: (state: S, meta?: any) => any;
  resolved?: (state: S, payload: any, meta?: any) => any;
  rejected?: (state: S, error: any, meta?: any) => any;
  finally?: (state: S, meta?: any) => any;
};

export type AsyncMutationTree<S> = {
  [key: string]: AsyncMutation<S>;
}

export type CommitAsync = {
  <T>(type: string, payload: PromiseLike<T>, meta?: any): Promise<T>;
};

export type ScopedCommitAsync = CommitAsync & {
  <T>(payload: PromiseLike<T>, meta?: any): Promise<T>;
}

export type AsyncActionContext<S, R, C extends CommitAsync = CommitAsync> = ActionContext<S, R>  & {
  commitAsync: C;
}

export type AsyncActionHandler<S, R, C extends CommitAsync = CommitAsync> = (
  this: Store<R>,
  injectee: AsyncActionContext<S, R, C>,
  payload?: any,
) => PromiseLike<any>;

export type AsyncAction<S, R> =
  | AsyncActionHandler<S, R, ScopedCommitAsync>
  | (AsyncMutation<S> & { handler: AsyncActionHandler<S, R, ScopedCommitAsync> });

export type AsyncActionTree<S, R> = { [key: string]: AsyncAction<S, R> };
export type AsyncActionHandlerTree<S, R> = { [key: string]: AsyncActionHandler<S, R> };

export type AsyncModule<S, R> = Module<S, R> & {
  readonly async?: boolean;
  actionsAsync?: AsyncActionTree<S, R>;
  mutationsAsync?: AsyncMutationTree<S>;
}

export type StateMutation<S> = (state: S, payload: any, meta?: any) => any;

export declare function wrapAction<S, R>(action: AsyncActionHandler<S, R>): ActionHandler<S, R>;

export declare function wrapActions<S, R>(tree: AsyncActionHandlerTree<S, R>): ActionTree<S, R>;

export declare function wrapMutation<S>(type: string, mutation: AsyncMutation<S>): MutationTree<S>;

export declare function wrapMutations<S>(tree: AsyncMutationTree<S>): MutationTree<S>;

export declare function wrapModule<S, R>(mod: AsyncModule<S, R>): Module<S, R>;

export declare function wrapModules<R>(modules?: ModuleTree<R>): ModuleTree<R> | undefined;

export declare function plugin(store: Store<any>): void;

export declare const module: Module<AsyncState, any>;

export default asyncModule;
