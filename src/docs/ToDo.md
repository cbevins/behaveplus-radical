- Run benchmarks in Node for time and memory

- Collect client-usage coverage

- Add Dag.label(nodeIdx)

- Add Modules and Links
  - setModules()
    - sets 'module.<module>' to 'active' or 'inactive'
    - calls Dag.link() to update 'link.<module>' to 'standAlone' or 'linkedTo<module>'
  - runModules()
    - calls setModules()
    - resets dag.enabled
    -