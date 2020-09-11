class Materializer {
  constructor(str) {
    this.target = str;
    this.activated = false;
  }
  activate() {
    this.activated = true;
  }
  materialize() {
    if (this.activated === true) return this.target;
    return undefined;
  }
}
