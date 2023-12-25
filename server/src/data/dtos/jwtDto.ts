type JwtClaim = {
  tc: string | null;
  id : number | null;
  email: string;
  nameSurname: string;
  type: UserType;
};

export type UserType = "user" | "company";

export default JwtClaim;
