/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2015, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import { applyMiddleware, compose, createStore } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import reducers from '../reducers';

const finalCreateStore = compose(
  applyMiddleware(thunk, createLogger())
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(reducers, initialState)
  return store
}