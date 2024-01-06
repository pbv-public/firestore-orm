import S from '@pbvision/schema'

import {
  getWithArgs,
  Context
} from './context.js'
import {
  DeletedTwiceError,
  InvalidFieldError,
  InvalidOptionsError,
  InvalidParameterError,
  ModelAlreadyExistsError,
  ModelTrackedTwiceError,
  TransactionFailedError,
  WriteAttemptedInReadOnlyTxError
} from './errors.js'
import {
  __Field,
  ArrayField,
  BooleanField,
  NumberField,
  ObjectField,
  StringField
} from './fields.js'
import { Key, UniqueKeyList } from './key.js'
import { Model } from './models.js'

/**
 * @module firestore
 */

/**
 * Setup the Firestore library before returning symbols clients can use.
 *
 * @param {Object} [firestoreDB] client to interact with db docs; from
 *   firebase/app::initializeApp
 * @returns {Object} Symbols that clients of this library can use.
 * @private
 */
export default function setup (firestoreDB) {
  Key.firestoreDB = firestoreDB
  const toExport = {
    S,
    Model,
    UniqueKeyList,
    Context,
    firestoreDB,

    // Errors
    DeletedTwiceError,
    InvalidFieldError,
    InvalidOptionsError,
    InvalidParameterError,
    ModelTrackedTwiceError,
    ModelAlreadyExistsError,
    TransactionFailedError,
    WriteAttemptedInReadOnlyTxError
  }
  if (Number(process.env.INDEBUGGER)) {
    toExport.__private = {
      __Field,
      fields: [
        ArrayField,
        BooleanField,
        NumberField,
        ObjectField,
        StringField
      ],
      getWithArgs
    }
  }
  return toExport
}
