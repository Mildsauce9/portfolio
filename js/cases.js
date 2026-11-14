// Case studies, rendered inside the result detail panel when a case_studies row is selected.
// Everything here is taken from the resume. It is a simplified picture: internal names are left out.
(function () {
  function node(title, sub) { return '<div class="node"><b>' + title + '</b><span>' + sub + '</span></div>'; }
  var arr = '<div class="arr" aria-hidden="true">&darr;</div>';
  function lane(n, title, nodes) { return '<div class="lane"><div class="lane-h"><i>' + n + '</i>' + title + '</div>' + nodes.join(arr) + '</div>'; }

  window.CASES = {
    'risk-assessment':
      '<div class="case">' +
        '<h3>One system for risk assessment that used to need manual intervention and several alerting tools</h3>' +
        '<div class="eyebrow">Case study · Deriv · risk assessment platform</div>' +
        '<div class="lanes">' +
          lane(1, 'Ingest', [
            node('Customer behavior data', 'live OLTP sources'),
            node('Streaming ingestion', 'idempotent · watermark cursors advance only after commit'),
            node('Columnar analytical store', 'Postgres + Citus · near real-time analysis')
          ]) +
          lane(2, 'Detect', [
            node('CEP rule engine', 'blue-green deployment · a new rule backfills a month or more of history in parallel'),
            node('Risk assessment scoring', 'Go workers score clients on their money-movement patterns'),
            node('Live materialized views', 'risk assessment signals and client clustering')
          ]) +
          lane(3, 'Serve', [
            node('Central Go data-access layer', 'endpoints for analysts and agents · machine-to-machine auth'),
            node('Analysts and AI agents', 'triage alerts, then close the case or escalate to a human reviewer')
          ]) +
        '</div>' +
        '<div class="metric">' +
          '<div class="m-t">One container ran backfill, detection and view generation one after another on a single thread</div>' +
          '<div class="bar"><span class="bl">Before</span><span class="track"><i style="width:100%"></i></span><em>300% CPU</em></div>' +
          '<div class="bar after"><span class="bl">After</span><span class="track"><i style="width:28.3%"></i></span><em>85% CPU</em></div>' +
          '<div class="m-s">Same work, run in parallel with throttling across cores and threads.</div>' +
        '</div>' +
        '<ul class="facts">' +
          '<li>Backfilling a new rule over a month or more of history causes no CPU spikes, lock contention or deadlocks on replicas fed by WAL replay.</li>' +
          '<li>When the database holding all trading data went down from low disk space, it was restored with no data loss.</li>' +
          '<li>Code is peer reviewed and deployed with GitHub Actions. Every agent posts each task, outcome and error to Slack, logs stream to OpenTelemetry, and SQL is back-tested on replica production environments.</li>' +
        '</ul>' +
        '<div class="note-s">Simplified diagram. Internal names are left out.</div>' +
      '</div>'
  };
})();
