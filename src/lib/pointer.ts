// shared normalized pointer (0..1), updated globally; read by the WebGL shader
export const pointer = { x: 0.5, y: 0.5 };

if (typeof window !== "undefined") {
  window.addEventListener("pointermove", (e) => {
    pointer.x = e.clientX / window.innerWidth;
    pointer.y = e.clientY / window.innerHeight;
  });
}
