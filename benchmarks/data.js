window.BENCHMARK_DATA = {
  "lastUpdate": 1757278037424,
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
      }
    ]
  }
}