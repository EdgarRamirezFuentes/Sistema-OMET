from .RouterBuilder import RouterBuilder

def create_project_router(main_directory, project):
    router_builder = RouterBuilder(project)
    router_script = router_builder.build()

    main_directory.writestr('web/src/App.jsx', router_script)

