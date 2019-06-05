class CssClock {
  constructor ({ root, side } = {}) {
    this.root = root || document.body;
    this.side = side || 256;
    this.halfSide = Math.round(this.side / 2);

    this.clockHolder = document.createElement('div');
    this.clockHolder.classList.add('clock-holder');
    this.clockHolder.setAttribute('style', this.getClockHolderStyle());

    for (let i = 1, len = 12; i <= len; i++) {
      const hourDiv = document.createElement('div');
      hourDiv.classList.add('hour-div');
      // hourDiv.classList.add('hour-' + i);
      hourDiv.setAttribute('style', this.getHourLabelStyle(i));
      hourDiv.appendChild(document.createTextNode(i));

      this.clockHolder.appendChild(hourDiv);
    }

    this.secondBar = document.createElement('div');
    this.secondBar.classList.add('second-bar');
    this.secondBar.setAttribute('style', this.getSecondBarStyle());
    this.clockHolder.appendChild(this.secondBar);

    this.minuteBar = document.createElement('div');
    this.minuteBar.classList.add('minute-bar');
    this.minuteBar.setAttribute('style', this.getMinuteBarStyle());
    this.clockHolder.appendChild(this.minuteBar);

    this.hourBar = document.createElement('div');
    this.hourBar.classList.add('hour-bar');
    this.hourBar.setAttribute('style', this.getHourBarStyle());
    this.clockHolder.appendChild(this.hourBar);

    this.root.appendChild(this.clockHolder);

    const animate = this.animate.bind(this);

    function loop () {
      animate();
      requestAnimationFrame(loop);
    }

    loop();
  }

  getClockHolderStyle () {
    const { side } = this;
    return 'height:' + side + 'px; width:' + side + 'px;'
  }

  getHourLabelStyle (hour) {
    let em = 0.5;
    let degree = hour * 30;
    if (hour === 7 || hour === 8 || hour === 9) {
      em = 0.25;
    } else if (hour === 10 || hour === 11) {
      em = 0.5;
    } else if (hour === 12) {
      em = 0.75;
      degree = 0;
    }

    const { side, halfSide } = this;
    const heightStyle = 'height:' + side + 'px;'
    const transformStyle = 'transform: translateX(calc(' + halfSide + 'px - ' + em + 'em)) rotate(' + degree + 'deg);';
    return heightStyle + transformStyle;
  }

  getBarStyle ({ topAdjust, degree }) {
    const { halfSide } = this;
    const side = halfSide - topAdjust;
    const borderTop = 'border-top-width: ' + side + 'px;';
    const borderBottom = 'border-bottom-width: ' + side + 'px;';
    const transform = 'transform: translate(calc(' + halfSide + 'px - 0.25em), ' + topAdjust + 'px) rotate(' + degree + 'deg);';
    return borderTop + borderBottom + transform;
  }

  getSecondBarStyle (currentDate) {
    const { side } = this;
    const topAdjust = Math.round(side / 20);
    const now = currentDate || new Date();
    const second = now.getSeconds();
    const degree = Math.round(second / 60 * 360);
    return this.getBarStyle({ degree, topAdjust });
  }

  getMinuteBarStyle (currentDate) {
    const { side } = this;
    const topAdjust = Math.round(side / 10);
    const now = currentDate || new Date();
    const minute = now.getMinutes();
    const second = now.getSeconds();
    const fullMinute = minute + (second / 60);
    const degree = Math.round(fullMinute / 60 * 360);
    return this.getBarStyle({ degree, topAdjust });
  }

  getHourBarStyle (currentDate) {
    const { side } = this;
    const topAdjust = Math.round(side / 5);
    const now = currentDate || new Date();
    let hour = now.getHours();
    if (hour > 12) {
      hour = hour - 12;
    }
    const minute = now.getMinutes();
    const fullHour = hour + (minute / 60);
    const degree = Math.round(fullHour / 12 * 360);
    return this.getBarStyle({ degree, topAdjust });
  }

  animate () {
    const now = new Date()
    this.secondBar.setAttribute('style', this.getSecondBarStyle(now));
    this.minuteBar.setAttribute('style', this.getMinuteBarStyle(now));
    this.hourBar.setAttribute('style', this.getHourBarStyle(now));
  }
}
