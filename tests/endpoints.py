import requests

def get_test_set_one():
    functions = ["coinflip", "isitup", "transport", "nslookup", "pwgen", "certinfo", "haveibeenpwned", "wiki"]
    expected_results = [0, 0, 0, 0, 0, 0, 0, 0]
    return functions, expected_results

def get_test_set_two():
    functions = ["notacommand", "30-50_feral_hogs", "transport", "nslookup", "randomCommand", "pwgen", "haveibeenpwned", "wikipedia_command"]
    expected_results = [1, 1, 0, 0, 1, 0, 0, 1]
    return functions, expected_results

def get_test_set_three():
    functions = ["commandoesntexist", "thisshouldfail", "nothing_to_see_here", "command"]
    expected_results = [1, 1, 1, 1]
    return functions, expected_results

def run_test_set(functions, expected_results):
    actual_results = []
    for function_name in functions:
        response = requests.get(f"https://faas.jamesmcdermott.ie/function/{function_name.strip()}")
        check_endpoint(function_name, response, actual_results)
    print(check_results(expected_results, actual_results))

def check_endpoint(function_name, response, actual_results):
    if f"error finding function {function_name}: server returned non-200 status code (404) for function, {function_name}" == response.text:
        actual_results.append(1)
    else:
        actual_results.append(0)

def check_results(expected_results, actual_results):
    if expected_results != actual_results:
        print(f"Expected: {expected_results}")
        print(f"Actually got: {actual_results}")
        return "Failed"
    else:
        return "Passed"

def main():
    functions, expected_results = get_test_set_one()
    run_test_set(functions, expected_results)
    functions, expected_results = get_test_set_two()
    run_test_set(functions, expected_results)
    functions, expected_results = get_test_set_three()
    run_test_set(functions, expected_results)

if __name__ == "__main__":
    main()

