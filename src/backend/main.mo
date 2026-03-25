import Map "mo:core/Map";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

actor {
  // Components
  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ─── Types ───────────────────────────────────────────────────────────

  public type ScriptCategory = { #DiscordBots; #WebScraping; #Automation };

  public type Script = {
    id : Nat;
    title : Text;
    description : Text;
    category : ScriptCategory;
    price : Nat;
    version : Text;
    downloadUrl : Text;
    languageTag : Text;
    createdAt : Int;
  };

  public type Purchase = {
    id : Nat;
    buyerPrincipal : Principal;
    scriptId : Nat;
    purchasedAt : Int;
  };

  // ─── State ────────────────────────────────────────────────────────────

  var nextScriptId : Nat = 1;
  var nextPurchaseId : Nat = 1;
  let scripts = Map.empty<Nat, Script>();
  let purchases = Map.empty<Nat, Purchase>();
  let userPurchases = Map.empty<Principal, Map.Map<Nat, Bool>>();
  let userProfiles = Map.empty<Principal, { username : Text; email : Text }>();

  // ─── User Registration ───────────────────────────────────────────────

  // Call this on login. First user to call becomes admin, others become regular users.
  public shared ({ caller }) func registerCaller() : async () {
    AccessControl.initializeUser(accessControlState, caller);
  };

  // ─── User Profiles ───────────────────────────────────────────────────

  public shared ({ caller }) func saveCallerUserProfile(profile : { username : Text; email : Text }) : async () {
    // Auto-register the user (first becomes admin, rest become users)
    AccessControl.initializeUser(accessControlState, caller);
    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?{ username : Text; email : Text } {
    userProfiles.get(caller);
  };

  // ─── Scripts (Admin CRUD) ────────────────────────────────────────────

  public shared ({ caller }) func addScript(
    title : Text,
    description : Text,
    category : ScriptCategory,
    price : Nat,
    version : Text,
    downloadUrl : Text,
    languageTag : Text,
  ) : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return 0;
    };
    let id = nextScriptId;
    nextScriptId += 1;
    scripts.add(id, { id; title; description; category; price; version; downloadUrl; languageTag; createdAt = 0 });
    id;
  };

  public shared ({ caller }) func updateScript(
    id : Nat,
    title : Text,
    description : Text,
    category : ScriptCategory,
    price : Nat,
    version : Text,
    downloadUrl : Text,
    languageTag : Text,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return false;
    };
    switch (scripts.get(id)) {
      case (null) { false };
      case (?_) {
        scripts.add(id, { id; title; description; category; price; version; downloadUrl; languageTag; createdAt = 0 });
        true;
      };
    };
  };

  public shared ({ caller }) func deleteScript(id : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return false;
    };
    switch (scripts.get(id)) {
      case (null) { false };
      case (?_) {
        scripts.remove(id);
        true;
      };
    };
  };

  public query func listScripts() : async [Script] {
    scripts.values().toArray();
  };

  public query func getScript(id : Nat) : async ?Script {
    scripts.get(id);
  };

  // ─── Purchases ───────────────────────────────────────────────────────

  public shared ({ caller }) func grantPurchase(buyer : Principal, scriptId : Nat) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return false;
    };
    _recordPurchase(buyer, scriptId);
    true;
  };

  public shared ({ caller }) func recordPurchase(scriptId : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      return false;
    };
    _recordPurchase(caller, scriptId);
    true;
  };

  func _recordPurchase(buyer : Principal, scriptId : Nat) {
    let id = nextPurchaseId;
    nextPurchaseId += 1;
    purchases.add(id, { id; buyerPrincipal = buyer; scriptId; purchasedAt = 0 });
    switch (userPurchases.get(buyer)) {
      case (null) {
        let newSet = Map.empty<Nat, Bool>();
        newSet.add(scriptId, true);
        userPurchases.add(buyer, newSet);
      };
      case (?set) {
        set.add(scriptId, true);
      };
    };
  };

  public query ({ caller }) func getMyPurchasedScripts() : async [Script] {
    switch (userPurchases.get(caller)) {
      case (null) { [] };
      case (?set) {
        let buf = List.empty<Script>();
        for ((sid, _) in set.entries()) {
          switch (scripts.get(sid)) {
            case (?s) { buf.add(s) };
            case (null) {};
          };
        };
        buf.toArray();
      };
    };
  };

  public query ({ caller }) func getDownloadUrl(scriptId : Nat) : async ?Text {
    switch (userPurchases.get(caller)) {
      case (null) { null };
      case (?set) {
        switch (set.get(scriptId)) {
          case (null) { null };
          case (?_) {
            switch (scripts.get(scriptId)) {
              case (null) { null };
              case (?s) { ?s.downloadUrl };
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func hasUserPurchased(scriptId : Nat) : async Bool {
    switch (userPurchases.get(caller)) {
      case (null) { false };
      case (?set) {
        switch (set.get(scriptId)) {
          case (null) { false };
          case (?_) { true };
        };
      };
    };
  };

  public shared ({ caller }) func listAllPurchases() : async [Purchase] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    purchases.values().toArray();
  };

  public shared ({ caller }) func listAllUsers() : async [{ principal : Principal; username : Text; email : Text }] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      return [];
    };
    let buf = List.empty<{ principal : Principal; username : Text; email : Text }>();
    for ((p, profile) in userProfiles.entries()) {
      buf.add({ principal = p; username = profile.username; email = profile.email });
    };
    buf.toArray();
  };
};
