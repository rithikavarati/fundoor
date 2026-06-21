import Debug "mo:core/Debug";

module {
  public type Activity = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    location : Text;
    rating : Float;
    tags : [Text];
    imageUrl : Text;
    websiteUrl : Text;
    eventDate : ?Text;
    eventDateEnd : ?Text;
  };
};
