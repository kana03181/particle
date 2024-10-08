let stageW = 0;
let stageH = 0;

let particleSize = 0; // パーティクルのサイズ
const MAX_LIFE = 50; // 寿命の最大値
const PARTICLE_SIZE = 25; // パーティクルのサイズ（定数）
const emitPerFrame = 3; // フレームあたりの粒子発生数
const particles = []; // 配列でパーティクルを管理

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

/** パーティクルクラス **/
class Particle{
  constructor(){
    this.reset();
  }

  /** 値を初期化します。 **/
  reset(){
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 0;
    this.scale = 0;
  }

}

resize();
tick();
window.addEventListener("resize", resize);

/** フレーム更新のタイミング **/
function tick() {
  setTimeout(tick, 16); // RAFだとブラウザ互換性に課題ありのためsetTimeoutを使用

  // パーティクルを発生
  emit();
  // パーティクルを更新
  update();
  // 画面を更新する
  draw();
}

/** リサイズ時のイベントです。 */
function resize() {
  stageW = innerWidth * devicePixelRatio;
  stageH = innerHeight * devicePixelRatio;

  canvas.width = stageW;
  canvas.height = stageH;

  particleSize = PARTICLE_SIZE * devicePixelRatio;
}

// パーティクルを発生させます
function emit() {
  for(let i = 0; i < emitPerFrame; i++){
    // オブジェクトの作成
    const particle = new Particle();

    // パーティクルの発生場所
    particle.x = stageW * Math.random();
    particle.y = (stageH * 3) / 4;

    // 動的にプロパティーを追加します。
    // 速度
    particle.vy = 30 * (Math.random() - 0.5);

    //寿命
    particle.life = MAX_LIFE;

    // パーティクルのシェイプ
    particle.type = Math.floor(Math.random() * 2) .toString();
    particles.push(particle);
  }
}

// パーティクルを更新します
function update() {
  // パーティクルの計算を行う
  for (let i = 0; i < particles.length; i++) {
    // オブジェクトの作成
    const particle = particles[i];
    // 重力
    particle.vy -= 1;
    // 摩擦
    particle.vy *= 0.92;
    // 速度を位置に適用
    particle.y += particle.vy;

    // パーティクルのサイズをライフ依存にする
    const scale = particle.life / MAX_LIFE;
    particle.scale = scale;
    // 寿命を減らす
    particle.life -= 1;
    // 寿命の判定
    if (particle.life <= 0) {
      // 配列からも削除
      particles.splice(i, 1);
      i -= 1;
    }
  }
}

// 描画します
function draw(time) {
  // 画面をリセット
  context.clearRect(0, 0, stageW, stageH);
  context.globalCompositeOperation = "lighter";

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    context.restore();

    context.beginPath();
    // 円を描く
    context.arc(
      particle.x,
      particle.y,
      particle.scale * particleSize,
      0,
      Math.PI * 2,
      false,
    );

    // 点滅ロジック 0.8〜1.0の間で乱数を得る
    const alpha = Math.random() * 0.2 + 0.8;

    switch(particle.type){
      case "0": // 塗りつぶした円「●」を描画
      context.fillStyle = `hsla(0, 0%, 50%, ${alpha})`;
      context.fill();
      break;

      case "1": // 線で円「○」を描画
      context.strokeStyle = `hsla(0, 0%, 50%, ${alpha})`;
      context.lineWidth = 5;
      context.stroke();
      break;
    }
    context.closePath();
  }
}
