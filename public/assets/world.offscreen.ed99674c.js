var p = Object.defineProperty,
  a = (Z, l, m) =>
    l in Z
      ? p(Z, l, { enumerable: !0, configurable: !0, writable: !0, value: m })
      : (Z[l] = m),
  G = (Z, l, m) => (a(Z, typeof l != "symbol" ? l + "" : l, m), m),
  R = (Z, l, m) => {
    if (!l.has(Z)) throw TypeError("Cannot " + m);
  },
  b = (Z, l, m) => (
    R(Z, l, "read from private field"), m ? m.call(Z) : l.get(Z)
  ),
  c = (Z, l, m) => {
    if (l.has(Z))
      throw TypeError("Cannot add the same private member more than once");
    l instanceof WeakSet ? l.add(Z) : l.set(Z, m);
  },
  u = (Z, l, m, V) => (
    R(Z, l, "write to private field"), V ? V.call(Z, m) : l.set(Z, m), m
  ),
  J = (Z, l, m) => (R(Z, l, "access private method"), m),
  X,
  d,
  W,
  Y;
const y =
  h =
    typeof window != "undefined" &&
    window.Blob &&
    new Blob([atob(y)], { type: "text/javascript;charset=utf-8" });
function L() {
  const Z = h && (window.URL || window.webkitURL).createObjectURL(h);
  try {
    return Z
      ? new Worker(Z, {})
      : new Worker("data:application/javascript;base64," + y, {
          type: "module",
        });
  } finally {
    Z && (window.URL || window.webkitURL).revokeObjectURL(Z);
  }
}
class N {
  constructor(l) {
    c(this, W),
      G(this, "initialized", !1),
      G(this, "offscreenWorkerInit", !1),
      G(this, "themeLoadedInit", !1),
      G(this, "pendingThemePromises", {}),
      c(this, X, void 0),
      c(this, d, void 0),
      G(this, "onRollResult", () => {}),
      G(this, "onRollComplete", () => {}),
      (this.onInitComplete = l.onInitComplete),
      u(this, X, l.canvas.transferControlToOffscreen()),
      u(this, d, new L()),
      (b(this, d).init = new Promise((m, V) => {
        this.offscreenWorkerInit = m;
      })),
      (this.initialized = J(this, W, Y).call(this, l));
  }
  connect(l) {
    b(this, d).postMessage({ action: "connect", port: l }, [l]);
  }
  updateConfig(l) {
    b(this, d).postMessage({ action: "updateConfig", options: l });
  }
  resize(l) {
    b(this, d).postMessage({ action: "resize", options: l });
  }
  async loadTheme(l) {
    return new Promise((m, V) => {
      if (Object.keys(this.pendingThemePromises).includes(l.theme)) return m();
      (this.pendingThemePromises[l.theme] = m),
        b(this, d).postMessage({ action: "loadTheme", options: l });
    }).catch((m) => console.error(m));
  }
  clear() {
    b(this, d).postMessage({ action: "clearDice" });
  }
  add(l) {
    b(this, d).postMessage({ action: "addDie", options: l });
  }
  addNonDie(l) {
    b(this, d).postMessage({ action: "addNonDie", options: l });
  }
  remove(l) {
    b(this, d).postMessage({ action: "removeDie", options: l });
  }
}
X = new WeakMap();
d = new WeakMap();
W = new WeakSet();
Y = async function (Z) {
  return (
    b(this, d).postMessage(
      {
        action: "init",
        canvas: b(this, X),
        width: Z.canvas.clientWidth,
        height: Z.canvas.clientHeight,
        options: Z.options,
      },
      [b(this, X)]
    ),
    (b(this, d).onmessage = (l) => {
      switch (l.data.action) {
        case "init-complete":
          this.offscreenWorkerInit();
          break;
        case "connect-complete":
          break;
        case "theme-loaded":
          l.data.id && this.pendingThemePromises[l.data.id](l.data.id);
          break;
        case "roll-result":
          this.onRollResult(l.data.die);
          break;
        case "roll-complete":
          this.onRollComplete();
          break;
        case "die-removed":
          this.onDieRemoved(l.data.rollId);
          break;
      }
    }),
    await b(this, d).init,
    this.onInitComplete(!0),
    !0
  );
};
export { N as default };