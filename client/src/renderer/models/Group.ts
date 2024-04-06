export default class Group {
  id: string;

  name: string;

  requiredRetweets: number;

  comment: string;

  constructor(
    id: string,
    name: string,
    requiredRetweets: number,
    comment: string,
  ) {
    this.id = id;
    this.name = name;
    this.requiredRetweets = requiredRetweets;
    this.comment = comment;
  }

  // static serialize(group: Group): object {
  //   return {
  //     ...group,
  //   };
  // }

  // static deserialize(object: any): Group {
  //   return new Group(
  //     object.id,
  //     object.groupId,
  //     object.requiredRetweets,
  //     object.comment,
  //     object.usedBy,
  //   );
  // }
}
