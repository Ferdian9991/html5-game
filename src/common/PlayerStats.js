export default class PlayerStats {
  static playerDeadAudioId = "player-dead-aud";
  static playerDeadAudioSrc = "assets/sound/player-dead.mp3";

  constructor() {
    this.health = 5;
    this.recentHealth = 5;
    this.maxHealth = 5;
    this.minHealth = 0;
    this.score = 0;
    this.isDead = false;

    this.isGameOver = false;
    window.playerStats = this;
  }

  static async preload({ addAudio }) {
    if (typeof addAudio !== "function") return;

    await addAudio(
      PlayerStats.playerDeadAudioId,
      PlayerStats.playerDeadAudioSrc
    );
  }

  addScore(score) {
    this.score += score;
  }

  reduceHealth() {
    if (this.health > this.minHealth) {
      this.recentHealth = this.health;
      this.health--;
    }
  }

  increaseHealth() {
    if (this.health < this.maxHealth) {
      this.health++;
      this.recentHealth = this.health;
    }
  }

  setDead() {
    this.isDead = true;

    const playerDeadAudio = window.getAudio(PlayerStats.playerDeadAudioId);

    if (playerDeadAudio) {
      playerDeadAudio.volume = 1;
      playerDeadAudio.currentTime = 0;
      playerDeadAudio.play();
    }
  }

  setAlive() {
    this.isDead = false;
  }

  isWin() {
    return this.score >= 100;
  }
}
