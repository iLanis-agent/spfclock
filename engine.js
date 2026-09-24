// SPFClock engine - sunscreen protection math (no DOM)
(function (root) {
  'use strict';

  // Fitzpatrick skin types I-VI: unprotected minutes to first burn in midday summer sun.
  var SKIN = [
    { id: 1, label: 'I - always burns', baseMin: 10 },
    { id: 2, label: 'II - burns easily', baseMin: 15 },
    { id: 3, label: 'III - sometimes burns', baseMin: 20 },
    { id: 4, label: 'IV - rarely burns', baseMin: 30 },
    { id: 5, label: 'V - very rarely burns', baseMin: 45 },
    { id: 6, label: 'VI - almost never burns', baseMin: 60 }
  ];

  // Lab protection time = baseMin * SPF. Real-world cap: dermatologists say reapply
  // at least every 2 hours regardless; water/sweat cuts effective time to 40-80 min.
  var MAX_DRY_MIN = 120;

  function skinById(id) {
    for (var i = 0; i < SKIN.length; i++) if (SKIN[i].id === Number(id)) return SKIN[i];
    return null;
  }

  // Effective protection window in minutes for one application.
  function protectionMinutes(skinId, spf, activity) {
    var s = skinById(skinId);
    if (!s) return 0;
    spf = Math.max(1, Math.min(100, Number(spf) || 0));
    var dry = Math.min(s.baseMin * spf, MAX_DRY_MIN);
    if (activity === 'swim') return Math.min(dry, 40);
    if (activity === 'sweat') return Math.min(dry, 80);
    return dry;
  }

  // Fraction of UV that still reaches skin with a given SPF (idealized): 1 - (spf-1)/spf = 1/spf.
  function uvFraction(spf) {
    spf = Math.max(1, Number(spf) || 1);
    return 1 / spf;
  }

  // Status of an application {appliedAt: minutes-since-midnight or epoch ms handled by caller}.
  // Here: pure time math on Date objects.
  function reapplyAt(appliedAt, skinId, spf, activity) {
    var mins = protectionMinutes(skinId, spf, activity);
    return new Date(appliedAt.getTime() + mins * 60000);
  }

  // status: minutesLeft and state for countdown display. state: 'protected' | 'reapply-now' | 'expired'
  function status(appliedAt, now, skinId, spf, activity) {
    var end = reapplyAt(appliedAt, skinId, spf, activity);
    var leftMs = end.getTime() - now.getTime();
    var leftMin = Math.round(leftMs / 60000);
    var state = leftMin > 10 ? 'protected' : (leftMin >= 0 ? 'reapply-now' : 'expired');
    return { minutesLeft: leftMin, state: state, endsAt: end };
  }

  // Session log stats: sessions = applications; total protected minutes; per-day sun dose estimate.
  function stats(sessions, skinId, spf) {
    var s = skinById(skinId);
    var total = 0;
    sessions.forEach(function (x) { total += protectionMinutes(x.skinId || skinId, x.spf || spf, x.activity); });
    return { applications: sessions.length, protectedMinutes: total, protectedHours: Math.round(total / 6) / 10 };
  }

  var api = { SKIN: SKIN, MAX_DRY_MIN: MAX_DRY_MIN, skinById: skinById,
    protectionMinutes: protectionMinutes, uvFraction: uvFraction,
    reapplyAt: reapplyAt, status: status, stats: stats };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SpfEngine = api;
})(typeof self !== 'undefined' ? self : this);
