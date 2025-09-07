window.BENCHMARK_DATA = {
  "lastUpdate": 1757278474144,
  "repoUrl": "https://github.com/mohsin-zaheer/mcp-server",
  "entries": {
    "n8n-mcp Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "mohsinzaheerbabar@gmail.com",
            "name": "Mohsin Zaheer",
            "username": "mohsin-zaheer"
          },
          "committer": {
            "email": "mohsinzaheerbabar@gmail.com",
            "name": "Mohsin Zaheer",
            "username": "mohsin-zaheer"
          },
          "distinct": true,
          "id": "87f61c2fb03b433e21559c345cc94d3002e209f8",
          "message": "refactor: Fix TypeScript compilation errors in Supabase database adapter\n\nCo-authored-by: aider (anthropic/claude-sonnet-4-20250514) <aider@aider.chat>",
          "timestamp": "2025-09-08T01:44:54+05:00",
          "tree_id": "f5cdce434bc90b7671d74c4442cb7e23133cc34d",
          "url": "https://github.com/mohsin-zaheer/mcp-server/commit/87f61c2fb03b433e21559c345cc94d3002e209f8"
        },
        "date": 1757278037170,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "sample - array sorting - small",
            "value": 0.0192,
            "range": "0.434",
            "unit": "ms",
            "extra": "52036 ops/sec"
          },
          {
            "name": "sample - array sorting - large",
            "value": 3.165,
            "range": "0.5741",
            "unit": "ms",
            "extra": "316 ops/sec"
          },
          {
            "name": "sample - string concatenation",
            "value": 0.0049,
            "range": "0.3059",
            "unit": "ms",
            "extra": "203241 ops/sec"
          },
          {
            "name": "sample - object creation",
            "value": 0.0674,
            "range": "0.4349",
            "unit": "ms",
            "extra": "14841 ops/sec"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "mohsinzaheerbabar@gmail.com",
            "name": "Mohsin Zaheer",
            "username": "mohsin-zaheer"
          },
          "committer": {
            "email": "mohsinzaheerbabar@gmail.com",
            "name": "Mohsin Zaheer",
            "username": "mohsin-zaheer"
          },
          "distinct": true,
          "id": "9db0ffefb7ac0967ae19b356a7502d7b80bd4afa",
          "message": "feat: force Supabase usage and remove SQLite fallback logic\n\nCo-authored-by: aider (anthropic/claude-sonnet-4-20250514) <aider@aider.chat>",
          "timestamp": "2025-09-08T01:52:17+05:00",
          "tree_id": "df3b621dcefb8e40aba8011213e3641fa3d75ce8",
          "url": "https://github.com/mohsin-zaheer/mcp-server/commit/9db0ffefb7ac0967ae19b356a7502d7b80bd4afa"
        },
        "date": 1757278473863,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "sample - array sorting - small",
            "value": 0.0189,
            "range": "0.22959999999999997",
            "unit": "ms",
            "extra": "52983 ops/sec"
          },
          {
            "name": "sample - array sorting - large",
            "value": 3.1325,
            "range": "0.4817",
            "unit": "ms",
            "extra": "319 ops/sec"
          },
          {
            "name": "sample - string concatenation",
            "value": 0.0048,
            "range": "0.24630000000000002",
            "unit": "ms",
            "extra": "207184 ops/sec"
          },
          {
            "name": "sample - object creation",
            "value": 0.0658,
            "range": "0.2912",
            "unit": "ms",
            "extra": "15198 ops/sec"
          }
        ]
      }
    ]
  }
}