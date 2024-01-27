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
  /**
   * Generates a globally unique ID.
   *
   * newId() generates IDs that are statistically globally unique using
   * firestoreDB's AutoId class. These IDs by default are 20 characters long
   * and may include numbers and letters (both lowercase and uppercase). This
   * function allows a shorter string to be returned for cases where the
   * identifier doesn't need to be so long. Of course, if it's too short and
   * too many are generated then duplicates may be generated. For
   * implementation details see https://github.com/googleapis/nodejs-firestore
   *
   * @param {Object} params
   * @param {integer} [len=20] can be modified to shorten the IDs length (at
   *   the expense of curtailing its statistical global uniqueness guarantee)
   * @param {boolean} [lowercaseOnly=true] whether to include only lowercase
   *   letters and digits in the generated ID (defaults to true)
   * @returns {string} the new ID string
   */
  function newId (len = 20, lowercaseOnly = true) {
    let id = firestoreDB.collection('tmp').doc().id
    assert(id.length >= len,
      `AutoId does not support generating ${len} length IDs (too long)`)
    if (lowercaseOnly) {
      id = id.toLowerCase()
    }
    return id.substring(0, len)
  }

  Key.firestoreDB = firestoreDB
  const toExport = {
    S,
    Model,
    UniqueKeyList,
    Context,
    firestoreDB,
    newId,

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
