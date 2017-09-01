'use babel';

import { CompositeDisposable } from 'atom';

$ = jQuery = require('jquery');
snowFall = require('./js/snowfall.js');
require('./js/rotate3Di.js');
require('./js/3d-falling-leaves.js');

export default {
  active: false,
  flakesActive: false,
  subscriptions: null,

  activate() {
    this.loadFall();
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'falling-leaves:toggle': () => this.toggle()
    }));

    if (atom.config.get('falling-leaves.autoToggle')) {
      this.toggle();
    }

    atom.config.observe('falling-leaves.leaves', (newValue) => {
      if (this.active) {
        this.stopFall();
        this.startFall();
      }
    });

    atom.config.observe('falling-leaves.flakes', (newValue) => {
      if (this.active) {
        this.stopFlakes();
        if(newValue.include) {
          this.startFlakes();
        }
      }
    });
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  getOptions() {
    options = {
      speedC: atom.config.get('falling-leaves.leaves.speed'),
      size: atom.config.get('falling-leaves.leaves.size'),
      numberOfLeaves: atom.config.get('falling-leaves.leaves.count'),
      leafStyles: 3,       // Number of leaf styles in the sprite (leaves.png)
      rotation: 1,        // Define rotation of leaves
      rotationTrue: 1,   // Whether leaves rotate (1) or not (0)
      cycleSpeed: 30,   // Animation speed (Inverse frames per second) (10-100)
    }
    return options;
  },

  loadFall() {
    options = this.getOptions();
    jQuery(document).octoberLeaves(options);
  },

  startFall() {
    options = this.getOptions();
    jQuery(document).octoberLeaves('start', options);
  },

  stopFall() {
    jQuery(document).octoberLeaves('stop');
  },

  startFlakes() {
    snowFall.snow(document.body, {
      flakeColor : '#F36F22',
      flakeCount : atom.config.get('falling-leaves.flakes.count'),
      minSize : atom.config.get('falling-leaves.flakes.minSize'),
      maxSize : atom.config.get('falling-leaves.flakes.maxSize')
    });
    this.flakesActive = true;
  },

  stopFlakes() {
    if (this.flakesActive) {
      snowFall.snow(document.body, 'clear');
      this.flakesActive = false;
    }
  },

  toggle() {
    if (this.active) {
      this.stopFall()

      if (this.flakesActive) {
        this.stopFlakes();
      }
    }
    else {
      this.startFall();

      if (atom.config.get('falling-leaves.flakes.include')) {
        this.startFlakes();
      }
    }
    this.active = !this.active;
  }
};
