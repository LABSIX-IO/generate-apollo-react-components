

/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: QCompanies
// ====================================================

export interface QCompanies_companies {
  id: string;
  name: string;
}

export interface QCompanies {
  companies: QCompanies_companies[];
}


/* tslint:disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: MLogin
// ====================================================

export interface MLogin_login {
  token: string;
  admin: boolean;
}

export interface MLogin {
  login: MLogin_login;
}

export interface MLoginVariables {
  email: string;
  password: string;
}

/* tslint:disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

//==============================================================
// END Enums and Input Objects
//==============================================================