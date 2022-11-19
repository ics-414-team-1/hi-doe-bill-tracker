import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const PrimaryOfficePublications = {
  PrimaryOffice: 'PrimaryOffice',
};

class PrimaryOfficeCollection extends BaseCollection {
  constructor() {
    super('PrimaryOffice', new SimpleSchema({
      measureNumber: Number,
      code: { type: String },
      office: { type: Array },
      'office.$': Object,
    }));
  }

  define({ measureNumber, code, office }) {
    const docID = this._collection.insert({ code, measureNumber, office });
    return docID;
  }

  update(docID, { code, measureNumber, office }) {
    const updateData = {};
    if (measureNumber) {
      updateData.measureNumber = measureNumber;
    }
    if (code) {
      updateData.code = code;
    }
    if (office) {
      updateData.office = office;
    }
    this._collection.update(docID, { $set: updateData });
  }

  publish() {
    if (Meteor.isServer) {
      // get the PrimaryOfficeCollection instance
      const instance = this;
      Meteor.publish(PrimaryOfficePublications.PrimaryOffice, function publish() {
        if (this.userId) {
          return instance._collection.find({});
        }
        return this.ready();
      });
    }
  }

  subscribePrimaryOffice() {
    if (Meteor.isClient) {
      return Meteor.subscribe(PrimaryOfficePublications.PrimaryOffice);
    }
    return null;
  }

  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const measureNumber = doc.measureNumber;
    const code = doc.code;
    const office = doc.office;
    return { measureNumber, code, office };
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or Advisor.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or Advisor.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.OFFICE_APPROVER]);
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const PrimaryOffice = new PrimaryOfficeCollection();
