from rest_framework.views import exception_handler


def slims_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        errors = []
        message = response.data.get('detail')
        if not message:
            for field, value in response.data.items():
                errors.append("{} : {}".format(field, " ".join(value)))
            response.data = {'data': [], 'message': 'Validation error', 'errors': errors}
        else:
            response.data = {'data': [], 'message': 'An error occurred', 'errors': [message]}
    return response
