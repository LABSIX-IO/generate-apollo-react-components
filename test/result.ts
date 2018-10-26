/* tslint:disable */
import { Query, Mutation } from "react-apollo";
import { QCompanies, MLogin, MLoginVariables } from "./mocktypes";

export class QCompaniesQuery extends Query<QCompanies> {
}

export class MLoginMutation extends Mutation<MLogin, MLoginVariables> {
}
