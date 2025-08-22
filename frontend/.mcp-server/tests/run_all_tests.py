#!/usr/bin/env python3
"""
Comprehensive Integration Test Suite
Runs all integration tests and provides a complete report.
"""

import subprocess
import sys
import time
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))


def run_test_suite(test_file: str, description: str):
    """Run a test suite and capture results."""
    print(f"\n🚀 Running {description}")
    print("=" * 60)
    
    start_time = time.time()
    
    try:
        # Run the test file using the virtual environment Python
        result = subprocess.run([
            './venv/bin/python', f'tests/{test_file}'
        ], capture_output=True, text=True, timeout=300)
        
        duration = time.time() - start_time
        
        # Print the output
        print(result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        
        success = result.returncode == 0
        
        return {
            'name': description,
            'file': test_file,
            'success': success,
            'duration': duration,
            'return_code': result.returncode
        }
        
    except subprocess.TimeoutExpired:
        duration = time.time() - start_time
        print(f"❌ Test suite timed out after {duration:.1f}s")
        return {
            'name': description,
            'file': test_file,
            'success': False,
            'duration': duration,
            'return_code': -1,
            'error': 'Timeout'
        }
    
    except Exception as e:
        duration = time.time() - start_time
        print(f"❌ Test suite error: {e}")
        return {
            'name': description,
            'file': test_file,
            'success': False,
            'duration': duration,
            'return_code': -2,
            'error': str(e)
        }


def extract_test_metrics(stdout_text: str):
    """Extract test metrics from stdout text."""
    metrics = {
        'total_tests': 0,
        'passed_tests': 0,
        'failed_tests': 0,
        'success_rate': 0.0
    }
    
    lines = stdout_text.split('\n')
    
    for line in lines:
        line = line.strip()
        
        # Look for summary patterns
        if 'Total tests:' in line:
            try:
                metrics['total_tests'] = int(line.split(':')[1].strip())
            except:
                pass
        elif 'Passed:' in line and '/' in line:
            try:
                parts = line.split(':')[1].strip().split('/')
                metrics['passed_tests'] = int(parts[0])
                metrics['total_tests'] = int(parts[1])
                metrics['failed_tests'] = metrics['total_tests'] - metrics['passed_tests']
            except:
                pass
        elif 'Success rate:' in line:
            try:
                rate_str = line.split(':')[1].strip().replace('%', '')
                metrics['success_rate'] = float(rate_str)
            except:
                pass
    
    return metrics


def main():
    """Run comprehensive integration test suite."""
    print("🧪 Comprehensive Cursor Automation Integration Test Suite")
    print("=" * 80)
    print(f"Started at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Define test suites
    test_suites = [
        ("test_integration.py", "Basic Integration Tests"),
        ("test_real_workflow.py", "Real Workflow Simulation Tests"),
        ("test_session_monitoring.py", "Session Management & Monitoring Tests"),
    ]
    
    # Run all test suites
    results = []
    total_start_time = time.time()
    
    for test_file, description in test_suites:
        result = run_test_suite(test_file, description)
        results.append(result)
        
        # Extract metrics from stdout if available
        if hasattr(result, 'stdout'):
            metrics = extract_test_metrics(result.get('stdout', ''))
            result['metrics'] = metrics
    
    total_duration = time.time() - total_start_time
    
    # Generate comprehensive report
    print(f"\n📊 COMPREHENSIVE TEST REPORT")
    print("=" * 80)
    
    successful_suites = 0
    total_test_cases = 0
    passed_test_cases = 0
    
    for result in results:
        status = "✅ PASS" if result['success'] else "❌ FAIL"
        print(f"{status} {result['name']}")
        print(f"  Duration: {result['duration']:.2f}s")
        print(f"  Return Code: {result['return_code']}")
        
        if result['success']:
            successful_suites += 1
        
        if 'error' in result:
            print(f"  Error: {result['error']}")
        
        # Add metrics if available
        if 'metrics' in result:
            m = result['metrics']
            total_test_cases += m['total_tests']
            passed_test_cases += m['passed_tests']
            if m['total_tests'] > 0:
                print(f"  Test Cases: {m['passed_tests']}/{m['total_tests']} passed ({m['success_rate']:.1f}%)")
    
    print(f"\n📈 SUMMARY STATISTICS")
    print("-" * 40)
    print(f"Total Test Suites: {len(results)}")
    print(f"Successful Suites: {successful_suites}")
    print(f"Suite Success Rate: {(successful_suites/len(results)*100):.1f}%")
    print(f"Total Execution Time: {total_duration:.2f}s")
    
    if total_test_cases > 0:
        print(f"\nTotal Individual Test Cases: {total_test_cases}")
        print(f"Passed Test Cases: {passed_test_cases}")
        print(f"Failed Test Cases: {total_test_cases - passed_test_cases}")
        print(f"Overall Test Case Success Rate: {(passed_test_cases/total_test_cases*100):.1f}%")
    
    # Feature coverage assessment
    print(f"\n🎯 FEATURE COVERAGE ASSESSMENT")
    print("-" * 40)
    
    features_tested = []
    
    for result in results:
        if "Basic Integration" in result['name']:
            features_tested.extend([
                "Cursor IDE availability",
                "Automation configuration",
                "MCP message bus operations",
                "Workflow manager initialization",
                "Session creation and management",
                "GUI automation tools",
                "Dry-run workflows",
                "Logging system"
            ])
        elif "Real Workflow" in result['name']:
            features_tested.extend([
                "2-agent workflow simulation",
                "Message bus performance",
                "Concurrent workflow handling",
                "Agent coordination",
                "Task execution simulation"
            ])
        elif "Session Management" in result['name']:
            features_tested.extend([
                "Session lifecycle management",
                "Status monitoring",
                "Loop detection",
                "Error handling and recovery",
                "Session persistence"
            ])
    
    print(f"Features Tested: {len(set(features_tested))}")
    for feature in sorted(set(features_tested)):
        print(f"  ✅ {feature}")
    
    # Recommendations
    print(f"\n💡 RECOMMENDATIONS")
    print("-" * 40)
    
    recommendations = []
    
    if successful_suites == len(results):
        recommendations.append("🎉 All test suites passing! System is production-ready.")
    else:
        recommendations.append("🔧 Some test suites failed - review logs for specific issues.")
    
    if total_test_cases > 0:
        overall_success_rate = (passed_test_cases/total_test_cases*100)
        if overall_success_rate >= 90:
            recommendations.append("🌟 Excellent test coverage and success rate.")
        elif overall_success_rate >= 75:
            recommendations.append("👍 Good test coverage - minor issues to address.")
        else:
            recommendations.append("⚠️  Test success rate below 75% - significant issues need attention.")
    
    if total_duration > 60:
        recommendations.append("⏱️  Test suite takes over 1 minute - consider optimization.")
    
    recommendations.extend([
        "📝 Consider adding performance benchmarks",
        "🔒 Add security-focused integration tests",
        "🌐 Test with different Cursor IDE versions",
        "📊 Add memory usage and resource monitoring tests"
    ])
    
    for rec in recommendations:
        print(f"  {rec}")
    
    # Exit with appropriate code
    exit_code = 0 if successful_suites == len(results) else 1
    
    print(f"\n🏁 Test Suite Complete (Exit Code: {exit_code})")
    print(f"Finished at: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    return exit_code


if __name__ == "__main__":
    sys.exit(main())