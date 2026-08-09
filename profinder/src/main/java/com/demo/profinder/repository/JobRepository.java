//package com.demo.profinder.repository;
//
//
//import com.demo.profinder.model.Job;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
package com.demo.profinder.repository;

import com.demo.profinder.model.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobRepository extends JpaRepository<Job, String> {
    long countByCompanyCode(String companyCode); // ✅ return type fixed
    Job findTopByCompanyCodeOrderByIdDesc(String companyCode); // ✅ optional if you want "Option 2" ID generation
}
