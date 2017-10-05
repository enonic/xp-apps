import {GraphQlRequest} from '../GraphQlRequest';
import PrincipalKey = api.security.PrincipalKey;
import Principal = api.security.Principal;
import PrincipalJson = api.security.PrincipalJson;
import Role = api.security.Role;
import RoleJson = api.security.RoleJson;
import Group = api.security.Group;
import GroupJson = api.security.GroupJson;
import User = api.security.User;
import UserJson = api.security.UserJson;

export class GetMembersRequest
    extends GraphQlRequest<any, Principal[]> {

    private key: PrincipalKey;

    private size: number = 100;

    private from: number = 0;

    constructor(key: PrincipalKey) {
        super();
        this.key = key;
    }

    setSize(value: number) : GetMembersRequest{
        this.size = value;
        return this;
    }

    setFrom(value: number) : GetMembersRequest{
        this.from = value;
        return this;
    }


    getVariables(): { [key: string]: any } {
        let vars = super.getVariables();
        if (this.key) {
            vars['key'] = this.key.toString();
        }
        vars['from'] = this.from;
        vars['size'] = this.size;
        return vars;
    }

    getQuery(): string {
        return `query ($key: String!, $from: Int, $size: Int) {
                    members (key: $key, from: $from, size: $size) {
                        key
                        name
                        path
                        description
                        displayName
                        email
                        login
                        memberships {
                            key
                            displayName
                        }
                        members
                        permissions {
                            principal {
                                key
                                displayName
                            }
                            allow
                            deny
                        }                       
                    }
                }`;
    }


    sendAndParse(): wemQ.Promise<Principal[]> {
        return this.query().then(result => this.fromJsonToPrincipal(result.members));
    }

    fromJsonToPrincipal(principalsJson: PrincipalJson[]): Principal[] {
        if (!principalsJson) {
            return [];
        }
        return principalsJson.map(principalJson => {
            let pKey: PrincipalKey = PrincipalKey.fromString(principalJson.key);
            if (pKey.isRole()) {
                return Role.fromJson(<RoleJson>principalJson);

            } else if (pKey.isGroup()) {
                return Group.fromJson(<GroupJson>principalJson);

            } else if (pKey.isUser()) {
                return User.fromJson(<UserJson>principalJson);
            }
        });
    }
}
