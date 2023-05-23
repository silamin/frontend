export interface SectionService {
  deleteItem(item: any, uid: any): void;

  fetchData(uid: any): any;
  addItem(uid: any, item): any;
}
